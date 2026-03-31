import type { Context } from 'hono';
import { recordService } from '../services/record.service';
import { logger } from '../utils/logger';
import type { RecordRequest, RecordQueryParams, ImportRecordRequest } from '../types/record';

export class RecordController {
  async getMonthlyStats(c: Context) {
    const user = c.get('user');
    const month = c.req.query('month');

    try {
      logger.info(`获取月度统计`, { userId: user.userId, month });
      const stats = await recordService.getMonthlyStats(user.userId, month);
      return c.json(stats);
    } catch (error) {
      logger.error(`获取月度统计失败`, error as Error, { userId: user.userId, month });
      return c.json({ error: '获取月度统计失败' }, 500);
    }
  }

  async getRecentRecords(c: Context) {
    const user = c.get('user');

    try {
      logger.info(`获取最近记录`, { userId: user.userId });
      const records = await recordService.getRecentRecords(user.userId);
      return c.json(records);
    } catch (error) {
      logger.error(`获取最近记录失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取最近记录失败' }, 500);
    }
  }

  async getRecords(c: Context) {
    const user = c.get('user');
    const params: RecordQueryParams = {
      startDate: c.req.query('startDate'),
      endDate: c.req.query('endDate'),
      type: c.req.query('type'),
    };

    try {
      logger.info(`获取记录列表`, { userId: user.userId, params });
      const records = await recordService.getRecords(user.userId, params);
      return c.json(records);
    } catch (error) {
      logger.error(`获取记录列表失败`, error as Error, { userId: user.userId, params });
      return c.json({ error: '获取记录失败' }, 500);
    }
  }

  async getRecordsByDate(c: Context) {
    const user = c.get('user');
    const cursor = c.req.query('cursor');
    const limitParam = c.req.query('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    try {
      logger.info(`获取分页记录`, { userId: user.userId, cursor, limit });
      const result = await recordService.getRecordsByDatePaginated(
        user.userId,
        cursor,
        limit
      );
      return c.json(result);
    } catch (error) {
      logger.error(`获取分页记录失败`, error as Error, { userId: user.userId, cursor, limit });
      return c.json({ error: '获取记录失败' }, 500);
    }
  }

  async batchImport(c: Context) {
    const user = c.get('user');

    try {
      const body = await c.req.json<{ records: ImportRecordRequest[] }>();

      if (!body.records || !Array.isArray(body.records) || body.records.length === 0) {
        logger.warn(`批量导入参数错误: 记录数组为空`, { userId: user.userId });
        return c.json({ error: '请提供要导入的记录数组' }, 400);
      }

      if (body.records.length > 1000) {
        logger.warn(`批量导入记录数超限`, { userId: user.userId, count: body.records.length });
        return c.json({ error: '单次导入最多支持 1000 条记录' }, 400);
      }

      logger.info(`开始批量导入`, { userId: user.userId, count: body.records.length });
      const result = await recordService.batchImportRecords(user.userId, body.records);

      if (result.failed > 0) {
        logger.warn(`批量导入部分失败`, { userId: user.userId, ...result });
      } else {
        logger.info(`批量导入成功`, { userId: user.userId, success: result.success });
      }

      return c.json(result, 201);
    } catch (error) {
      logger.error(`批量导入失败`, error as Error, { userId: user.userId });
      return c.json({ error: '批量导入失败' }, 500);
    }
  }

  async deleteImportRecords(c: Context) {
    const user = c.get('user');

    try {
      logger.info(`删除导入记录`, { userId: user.userId });
      const result = await recordService.deleteImportRecords(user.userId);
      logger.info(`删除导入记录成功`, { userId: user.userId, deletedCount: result.deletedCount });
      return c.json({
        message: '导入数据删除成功',
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      logger.error(`删除导入记录失败`, error as Error, { userId: user.userId });
      return c.json({ error: '删除导入数据失败' }, 500);
    }
  }

  async createRecord(c: Context) {
    const user = c.get('user');

    try {
      const body = await c.req.json<RecordRequest>();

      if (!body.type || !body.category || !body.amount || !body.date) {
        logger.warn(`创建记录参数错误`, { userId: user.userId, body });
        return c.json({ error: '类型、分类、金额和日期不能为空' }, 400);
      }

      logger.info(`创建记录`, { userId: user.userId, type: body.type, amount: body.amount, date: body.date });
      const record = await recordService.createRecord(user.userId, body);
      logger.info(`创建记录成功`, { userId: user.userId, recordId: record.id });
      return c.json(record, 201);
    } catch (error) {
      logger.error(`创建记录失败`, error as Error, { userId: user.userId });
      return c.json({ error: '创建记录失败' }, 500);
    }
  }

  async updateRecord(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      const body = await c.req.json<Partial<RecordRequest>>();

      logger.info(`更新记录`, { userId: user.userId, recordId: id, body });
      const record = await recordService.updateRecord(user.userId, id, body);

      if (!record) {
        logger.warn(`更新记录不存在`, { userId: user.userId, recordId: id });
        return c.json({ error: '记录不存在' }, 404);
      }

      logger.info(`更新记录成功`, { userId: user.userId, recordId: id });
      return c.json(record);
    } catch (error) {
      logger.error(`更新记录失败`, error as Error, { userId: user.userId, recordId: id });
      return c.json({ error: '更新记录失败' }, 500);
    }
  }

  async deleteRecord(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      logger.info(`删除记录`, { userId: user.userId, recordId: id });
      const success = await recordService.deleteRecord(user.userId, id);

      if (!success) {
        logger.warn(`删除记录不存在`, { userId: user.userId, recordId: id });
        return c.json({ error: '记录不存在' }, 404);
      }

      logger.info(`删除记录成功`, { userId: user.userId, recordId: id });
      return c.json({ message: '删除成功' });
    } catch (error) {
      logger.error(`删除记录失败`, error as Error, { userId: user.userId, recordId: id });
      return c.json({ error: '删除记录失败' }, 500);
    }
  }
}

export const recordController = new RecordController();
