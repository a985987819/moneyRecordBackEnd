import type { Context } from 'hono';
import { recurringService } from '../services/recurring.service';
import { logger } from '../utils/logger';
import type { RecurringRecordRequest } from '../types/recurring';

export class RecurringController {
  // 获取所有周期记账
  async getAllRecurring(c: Context) {
    const user = c.get('user');

    try {
      logger.info(`获取周期记账列表`, { userId: user.userId });
      const records = await recurringService.getAllRecurring(user.userId);
      return c.json({ records });
    } catch (error) {
      logger.error(`获取周期记账列表失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取周期记账列表失败' }, 500);
    }
  }

  // 创建周期记账
  async createRecurring(c: Context) {
    const user = c.get('user');

    try {
      const body = await c.req.json<RecurringRecordRequest>();

      if (!body.type || !body.category || !body.amount || !body.frequency || !body.startDate) {
        logger.warn(`创建周期记账参数错误`, { userId: user.userId, body });
        return c.json({ error: '类型、分类、金额、频率和开始日期不能为空' }, 400);
      }

      if (body.amount <= 0) {
        logger.warn(`创建周期记账金额错误`, { userId: user.userId, amount: body.amount });
        return c.json({ error: '金额必须大于0' }, 400);
      }

      logger.info(`创建周期记账`, { userId: user.userId, body });
      const record = await recurringService.createRecurring(user.userId, body);

      logger.info(`创建周期记账成功`, { userId: user.userId, recordId: record.id });
      return c.json({ record, message: '周期记账创建成功' }, 201);
    } catch (error) {
      logger.error(`创建周期记账失败`, error as Error, { userId: user.userId });
      return c.json({ error: '创建周期记账失败' }, 500);
    }
  }

  // 更新周期记账
  async updateRecurring(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      const body = await c.req.json<Partial<RecurringRecordRequest>>();

      logger.info(`更新周期记账`, { userId: user.userId, id, body });
      const record = await recurringService.updateRecurring(user.userId, id, body);

      if (!record) {
        logger.warn(`周期记账不存在`, { userId: user.userId, id });
        return c.json({ error: '周期记账不存在' }, 404);
      }

      logger.info(`更新周期记账成功`, { userId: user.userId, id });
      return c.json({ record, message: '周期记账更新成功' });
    } catch (error) {
      logger.error(`更新周期记账失败`, error as Error, { userId: user.userId, id });
      return c.json({ error: '更新周期记账失败' }, 500);
    }
  }

  // 删除周期记账
  async deleteRecurring(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      logger.info(`删除周期记账`, { userId: user.userId, id });
      const deleted = await recurringService.deleteRecurring(user.userId, id);

      if (!deleted) {
        logger.warn(`周期记账不存在`, { userId: user.userId, id });
        return c.json({ error: '周期记账不存在' }, 404);
      }

      logger.info(`删除周期记账成功`, { userId: user.userId, id });
      return c.json({ message: '周期记账删除成功' });
    } catch (error) {
      logger.error(`删除周期记账失败`, error as Error, { userId: user.userId, id });
      return c.json({ error: '删除周期记账失败' }, 500);
    }
  }

  // 切换启用/禁用状态
  async toggleRecurring(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      logger.info(`切换周期记账状态`, { userId: user.userId, id });
      const record = await recurringService.toggleRecurring(user.userId, id);

      if (!record) {
        logger.warn(`周期记账不存在`, { userId: user.userId, id });
        return c.json({ error: '周期记账不存在' }, 404);
      }

      logger.info(`切换周期记账状态成功`, { userId: user.userId, id, isActive: record.isActive });
      return c.json({
        record,
        message: record.isActive ? '周期记账已启用' : '周期记账已禁用',
      });
    } catch (error) {
      logger.error(`切换周期记账状态失败`, error as Error, { userId: user.userId, id });
      return c.json({ error: '切换周期记账状态失败' }, 500);
    }
  }

  // 获取统计
  async getSummary(c: Context) {
    const user = c.get('user');

    try {
      logger.info(`获取周期记账统计`, { userId: user.userId });
      const summary = await recurringService.getSummary(user.userId);
      return c.json({ summary });
    } catch (error) {
      logger.error(`获取周期记账统计失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取周期记账统计失败' }, 500);
    }
  }
}

export const recurringController = new RecurringController();
