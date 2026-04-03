import type { Context } from 'hono';
import { budgetService } from '../services/budget.service';
import { logger } from '../utils/logger';
import type { BudgetRequest } from '../types/budget';
import { safeParseInt, validateAmount } from '../utils/validation';

export class BudgetController {
  // 获取当前月预算
  async getCurrentBudget(c: Context) {
    const user = c.get('user');

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      logger.info(`获取当前月预算`, { userId: user.userId, year, month });
      const budget = await budgetService.getBudget(user.userId, year, month);

      if (!budget) {
        logger.info(`当前月无预算`, { userId: user.userId, year, month });
        return c.json({ budget: null, message: '本月尚未设置预算' });
      }

      logger.info(`获取当前月预算成功`, { userId: user.userId, budget });
      return c.json({ budget });
    } catch (error) {
      logger.error(`获取当前月预算失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取预算失败' }, 500);
    }
  }

  // 获取指定月份预算
  async getBudgetByMonth(c: Context) {
    const user = c.get('user');
    const year = safeParseInt(c.req.query('year'), new Date().getFullYear());
    const month = safeParseInt(c.req.query('month'), new Date().getMonth() + 1);

    if (month < 1 || month > 12) {
      logger.warn(`获取预算参数错误`, { userId: user.userId, year, month });
      return c.json({ error: '月份参数无效，应为1-12' }, 400);
    }

    try {
      logger.info(`获取指定月预算`, { userId: user.userId, year, month });
      const budget = await budgetService.getBudget(user.userId, year, month);

      if (!budget) {
        logger.info(`指定月无预算`, { userId: user.userId, year, month });
        return c.json({ budget: null, message: '该月份尚未设置预算' });
      }

      logger.info(`获取指定月预算成功`, { userId: user.userId, budget });
      return c.json({ budget });
    } catch (error) {
      logger.error(`获取指定月预算失败`, error as Error, { userId: user.userId, year, month });
      return c.json({ error: '获取预算失败' }, 500);
    }
  }

  // 设置预算（创建或更新）
  async setBudget(c: Context) {
    const user = c.get('user');

    try {
      const body = await c.req.json<BudgetRequest>();

      if (typeof body.amount !== 'number' || body.amount < 0) {
        logger.warn(`设置预算参数错误`, { userId: user.userId, body });
        return c.json({ error: '预算金额必须是非负数' }, 400);
      }

      logger.info(`设置预算`, { userId: user.userId, body });
      const budget = await budgetService.setBudget(user.userId, body);

      logger.info(`设置预算成功`, { userId: user.userId, budget });
      return c.json({ budget, message: '预算设置成功' });
    } catch (error) {
      logger.error(`设置预算失败`, error as Error, { userId: user.userId });
      return c.json({ error: '设置预算失败' }, 500);
    }
  }

  // 删除预算
  async deleteBudget(c: Context) {
    const user = c.get('user');
    const year = safeParseInt(c.req.query('year'), new Date().getFullYear());
    const month = safeParseInt(c.req.query('month'), new Date().getMonth() + 1);

    if (month < 1 || month > 12) {
      logger.warn(`删除预算参数错误`, { userId: user.userId, year, month });
      return c.json({ error: '月份参数无效，应为1-12' }, 400);
    }

    try {
      logger.info(`删除预算`, { userId: user.userId, year, month });
      const success = await budgetService.deleteBudget(user.userId, year, month);

      if (!success) {
        logger.warn(`删除预算不存在`, { userId: user.userId, year, month });
        return c.json({ error: '该月份预算不存在' }, 404);
      }

      logger.info(`删除预算成功`, { userId: user.userId, year, month });
      return c.json({ message: '预算删除成功' });
    } catch (error) {
      logger.error(`删除预算失败`, error as Error, { userId: user.userId, year, month });
      return c.json({ error: '删除预算失败' }, 500);
    }
  }

  // 获取预算统计
  async getBudgetStats(c: Context) {
    const user = c.get('user');

    try {
      logger.info(`获取预算统计`, { userId: user.userId });
      const stats = await budgetService.getBudgetStats(user.userId);

      logger.info(`获取预算统计成功`, { userId: user.userId, stats });
      return c.json(stats);
    } catch (error) {
      logger.error(`获取预算统计失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取预算统计失败' }, 500);
    }
  }

  // 获取最近几个月预算
  async getRecentBudgets(c: Context) {
    const user = c.get('user');
    const months = safeParseInt(c.req.query('months'), 6);

    if (months < 1 || months > 60) {
      logger.warn(`获取最近预算参数错误`, { userId: user.userId, months });
      return c.json({ error: '月份数参数无效，应为1-60' }, 400);
    }

    try {
      logger.info(`获取最近预算`, { userId: user.userId, months });
      const budgets = await budgetService.getRecentBudgets(user.userId, months);

      logger.info(`获取最近预算成功`, { userId: user.userId, count: budgets.length });
      return c.json({ budgets });
    } catch (error) {
      logger.error(`获取最近预算失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取预算列表失败' }, 500);
    }
  }
}

export const budgetController = new BudgetController();
