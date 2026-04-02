import type { Context } from 'hono';
import { reminderService } from '../services/reminder.service';
import { logger } from '../utils/logger';
import type { ReminderRequest } from '../types/reminder';

export class ReminderController {
  // 获取所有提醒
  async getAllReminders(c: Context) {
    const user = c.get('user');

    try {
      logger.info(`获取提醒列表`, { userId: user.userId });
      const reminders = await reminderService.getAllReminders(user.userId);
      return c.json({ reminders });
    } catch (error) {
      logger.error(`获取提醒列表失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取提醒列表失败' }, 500);
    }
  }

  // 创建提醒
  async createReminder(c: Context) {
    const user = c.get('user');

    try {
      const body = await c.req.json<ReminderRequest>();

      if (!body.type || !body.time) {
        logger.warn(`创建提醒参数错误`, { userId: user.userId, body });
        return c.json({ error: '提醒类型和时间不能为空' }, 400);
      }

      // 验证时间格式 HH:mm
      const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timePattern.test(body.time)) {
        logger.warn(`提醒时间格式错误`, { userId: user.userId, time: body.time });
        return c.json({ error: '时间格式不正确，应为 HH:mm' }, 400);
      }

      logger.info(`创建提醒`, { userId: user.userId, body });
      const reminder = await reminderService.createReminder(user.userId, body);

      logger.info(`创建提醒成功`, { userId: user.userId, reminderId: reminder.id });
      return c.json({ reminder, message: '提醒创建成功' }, 201);
    } catch (error) {
      logger.error(`创建提醒失败`, error as Error, { userId: user.userId });
      return c.json({ error: '创建提醒失败' }, 500);
    }
  }

  // 更新提醒
  async updateReminder(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      const body = await c.req.json<Partial<ReminderRequest>>();

      // 验证时间格式
      if (body.time) {
        const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timePattern.test(body.time)) {
          logger.warn(`提醒时间格式错误`, { userId: user.userId, time: body.time });
          return c.json({ error: '时间格式不正确，应为 HH:mm' }, 400);
        }
      }

      logger.info(`更新提醒`, { userId: user.userId, id, body });
      const reminder = await reminderService.updateReminder(user.userId, id, body);

      if (!reminder) {
        logger.warn(`提醒不存在`, { userId: user.userId, id });
        return c.json({ error: '提醒不存在' }, 404);
      }

      logger.info(`更新提醒成功`, { userId: user.userId, id });
      return c.json({ reminder, message: '提醒更新成功' });
    } catch (error) {
      logger.error(`更新提醒失败`, error as Error, { userId: user.userId, id });
      return c.json({ error: '更新提醒失败' }, 500);
    }
  }

  // 删除提醒
  async deleteReminder(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      logger.info(`删除提醒`, { userId: user.userId, id });
      const deleted = await reminderService.deleteReminder(user.userId, id);

      if (!deleted) {
        logger.warn(`提醒不存在`, { userId: user.userId, id });
        return c.json({ error: '提醒不存在' }, 404);
      }

      logger.info(`删除提醒成功`, { userId: user.userId, id });
      return c.json({ message: '提醒删除成功' });
    } catch (error) {
      logger.error(`删除提醒失败`, error as Error, { userId: user.userId, id });
      return c.json({ error: '删除提醒失败' }, 500);
    }
  }

  // 切换启用/禁用状态
  async toggleReminder(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      logger.info(`切换提醒状态`, { userId: user.userId, id });
      const reminder = await reminderService.toggleReminder(user.userId, id);

      if (!reminder) {
        logger.warn(`提醒不存在`, { userId: user.userId, id });
        return c.json({ error: '提醒不存在' }, 404);
      }

      logger.info(`切换提醒状态成功`, { userId: user.userId, id, isEnabled: reminder.isEnabled });
      return c.json({
        reminder,
        message: reminder.isEnabled ? '提醒已启用' : '提醒已禁用',
      });
    } catch (error) {
      logger.error(`切换提醒状态失败`, error as Error, { userId: user.userId, id });
      return c.json({ error: '切换提醒状态失败' }, 500);
    }
  }
}

export const reminderController = new ReminderController();
