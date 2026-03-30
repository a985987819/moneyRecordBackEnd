import type { Context } from 'hono';
import { recordService } from '../services/record.service';
import type { RecordRequest, RecordQueryParams } from '../types/record';

export class RecordController {
  async getMonthlyStats(c: Context) {
    try {
      const user = c.get('user');
      const month = c.req.query('month');
      const stats = await recordService.getMonthlyStats(user.userId, month);
      return c.json(stats);
    } catch (error) {
      return c.json({ error: '获取月度统计失败' }, 500);
    }
  }

  async getRecentRecords(c: Context) {
    try {
      const user = c.get('user');
      const records = await recordService.getRecentRecords(user.userId);
      return c.json(records);
    } catch (error) {
      return c.json({ error: '获取最近记录失败' }, 500);
    }
  }

  async getRecords(c: Context) {
    try {
      const user = c.get('user');
      const params: RecordQueryParams = {
        startDate: c.req.query('startDate'),
        endDate: c.req.query('endDate'),
        type: c.req.query('type'),
      };
      const records = await recordService.getRecords(user.userId, params);
      return c.json(records);
    } catch (error) {
      return c.json({ error: '获取记录失败' }, 500);
    }
  }

  async createRecord(c: Context) {
    try {
      const user = c.get('user');
      const body = await c.req.json<RecordRequest>();

      if (!body.type || !body.category || !body.amount || !body.date) {
        return c.json({ error: '类型、分类、金额和日期不能为空' }, 400);
      }

      const record = await recordService.createRecord(user.userId, body);
      return c.json(record, 201);
    } catch (error) {
      return c.json({ error: '创建记录失败' }, 500);
    }
  }

  async updateRecord(c: Context) {
    try {
      const user = c.get('user');
      const id = c.req.param('id');
      const body = await c.req.json<Partial<RecordRequest>>();

      const record = await recordService.updateRecord(user.userId, id, body);
      if (!record) {
        return c.json({ error: '记录不存在' }, 404);
      }
      return c.json(record);
    } catch (error) {
      return c.json({ error: '更新记录失败' }, 500);
    }
  }

  async deleteRecord(c: Context) {
    try {
      const user = c.get('user');
      const id = c.req.param('id');

      const success = await recordService.deleteRecord(user.userId, id);
      if (!success) {
        return c.json({ error: '记录不存在' }, 404);
      }
      return c.json({ message: '删除成功' });
    } catch (error) {
      return c.json({ error: '删除记录失败' }, 500);
    }
  }
}

export const recordController = new RecordController();
