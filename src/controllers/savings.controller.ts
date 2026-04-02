import type { Context } from 'hono';
import { savingsService } from '../services/savings.service';
import { logger } from '../utils/logger';
import type { SavingsGoalRequest, DepositRequest, WithdrawRequest } from '../types/savings';

export class SavingsController {
  // 获取所有储蓄目标
  async getAllGoals(c: Context) {
    const user = c.get('user');

    try {
      logger.info(`获取储蓄目标列表`, { userId: user.userId });
      const goals = await savingsService.getAllGoals(user.userId);
      return c.json({ goals });
    } catch (error) {
      logger.error(`获取储蓄目标列表失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取储蓄目标列表失败' }, 500);
    }
  }

  // 创建储蓄目标
  async createGoal(c: Context) {
    const user = c.get('user');

    try {
      const body = await c.req.json<SavingsGoalRequest>();

      if (!body.name || !body.targetAmount || !body.icon || !body.color) {
        logger.warn(`创建储蓄目标参数错误`, { userId: user.userId, body });
        return c.json({ error: '目标名称、目标金额、图标和颜色不能为空' }, 400);
      }

      if (body.targetAmount <= 0) {
        logger.warn(`创建储蓄目标金额错误`, { userId: user.userId, targetAmount: body.targetAmount });
        return c.json({ error: '目标金额必须大于0' }, 400);
      }

      logger.info(`创建储蓄目标`, { userId: user.userId, body });
      const goal = await savingsService.createGoal(user.userId, body);

      logger.info(`创建储蓄目标成功`, { userId: user.userId, goalId: goal.id });
      return c.json({ goal, message: '储蓄目标创建成功' }, 201);
    } catch (error) {
      logger.error(`创建储蓄目标失败`, error as Error, { userId: user.userId });
      return c.json({ error: '创建储蓄目标失败' }, 500);
    }
  }

  // 更新储蓄目标
  async updateGoal(c: Context) {
    const user = c.get('user');
    const goalId = c.req.param('id');

    try {
      const body = await c.req.json<Partial<SavingsGoalRequest>>();

      logger.info(`更新储蓄目标`, { userId: user.userId, goalId, body });
      const goal = await savingsService.updateGoal(user.userId, goalId, body);

      if (!goal) {
        logger.warn(`储蓄目标不存在`, { userId: user.userId, goalId });
        return c.json({ error: '储蓄目标不存在' }, 404);
      }

      logger.info(`更新储蓄目标成功`, { userId: user.userId, goalId });
      return c.json({ goal, message: '储蓄目标更新成功' });
    } catch (error) {
      logger.error(`更新储蓄目标失败`, error as Error, { userId: user.userId, goalId });
      return c.json({ error: '更新储蓄目标失败' }, 500);
    }
  }

  // 删除储蓄目标
  async deleteGoal(c: Context) {
    const user = c.get('user');
    const goalId = c.req.param('id');

    try {
      logger.info(`删除储蓄目标`, { userId: user.userId, goalId });
      const deleted = await savingsService.deleteGoal(user.userId, goalId);

      if (!deleted) {
        logger.warn(`储蓄目标不存在`, { userId: user.userId, goalId });
        return c.json({ error: '储蓄目标不存在' }, 404);
      }

      logger.info(`删除储蓄目标成功`, { userId: user.userId, goalId });
      return c.json({ message: '储蓄目标删除成功' });
    } catch (error) {
      logger.error(`删除储蓄目标失败`, error as Error, { userId: user.userId, goalId });
      return c.json({ error: '删除储蓄目标失败' }, 500);
    }
  }

  // 向目标存钱
  async deposit(c: Context) {
    const user = c.get('user');
    const goalId = c.req.param('id');

    try {
      const body = await c.req.json<DepositRequest>();

      if (!body.amount || body.amount <= 0) {
        logger.warn(`存款金额错误`, { userId: user.userId, goalId, amount: body.amount });
        return c.json({ error: '存款金额必须大于0' }, 400);
      }

      logger.info(`向储蓄目标存款`, { userId: user.userId, goalId, amount: body.amount });
      const goal = await savingsService.deposit(user.userId, goalId, body);

      if (!goal) {
        logger.warn(`储蓄目标不存在`, { userId: user.userId, goalId });
        return c.json({ error: '储蓄目标不存在' }, 404);
      }

      logger.info(`存款成功`, { userId: user.userId, goalId, amount: body.amount });
      return c.json({ goal, message: '存款成功' });
    } catch (error) {
      if (error instanceof Error && error.message === '余额不足') {
        return c.json({ error: '余额不足' }, 400);
      }
      logger.error(`存款失败`, error as Error, { userId: user.userId, goalId });
      return c.json({ error: '存款失败' }, 500);
    }
  }

  // 从目标取钱
  async withdraw(c: Context) {
    const user = c.get('user');
    const goalId = c.req.param('id');

    try {
      const body = await c.req.json<WithdrawRequest>();

      if (!body.amount || body.amount <= 0) {
        logger.warn(`取款金额错误`, { userId: user.userId, goalId, amount: body.amount });
        return c.json({ error: '取款金额必须大于0' }, 400);
      }

      logger.info(`从储蓄目标取款`, { userId: user.userId, goalId, amount: body.amount });
      const goal = await savingsService.withdraw(user.userId, goalId, body);

      if (!goal) {
        logger.warn(`储蓄目标不存在`, { userId: user.userId, goalId });
        return c.json({ error: '储蓄目标不存在' }, 404);
      }

      logger.info(`取款成功`, { userId: user.userId, goalId, amount: body.amount });
      return c.json({ goal, message: '取款成功' });
    } catch (error) {
      if (error instanceof Error && error.message === '余额不足') {
        return c.json({ error: '余额不足' }, 400);
      }
      logger.error(`取款失败`, error as Error, { userId: user.userId, goalId });
      return c.json({ error: '取款失败' }, 500);
    }
  }

  // 获取储蓄统计
  async getSummary(c: Context) {
    const user = c.get('user');

    try {
      logger.info(`获取储蓄统计`, { userId: user.userId });
      const summary = await savingsService.getSummary(user.userId);
      return c.json({ summary });
    } catch (error) {
      logger.error(`获取储蓄统计失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取储蓄统计失败' }, 500);
    }
  }
}

export const savingsController = new SavingsController();
