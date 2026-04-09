import type { Context } from 'hono';
import { debtService } from '../services/debt.service';
import { logger } from '../utils/logger';
import type { DebtRequest, RepayRequest } from '../types/debt';

export class DebtController {
  // 获取所有借贷记录
  async getAllDebts(c: Context) {
    const user = c.get('user');

    try {
      logger.info(`获取借贷列表`, { userId: user.userId });
      const debts = await debtService.getAllDebts(user.userId);
      return c.json({ debts });
    } catch (error) {
      logger.error(`获取借贷列表失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取借贷列表失败' }, 500);
    }
  }

  // 创建借贷记录
  async createDebt(c: Context) {
    const user = c.get('user');

    try {
      const body = await c.req.json<DebtRequest>();

      if (!body.type || !body.personName || !body.amount || !body.date) {
        logger.warn(`创建借贷参数错误`, { userId: user.userId, body });
        return c.json({ error: '类型、对方姓名、金额和日期不能为空' }, 400);
      }

      if (body.amount <= 0) {
        logger.warn(`创建借贷金额错误`, { userId: user.userId, amount: body.amount });
        return c.json({ error: '金额必须大于0' }, 400);
      }

      logger.info(`创建借贷记录`, { userId: user.userId, body });
      const debt = await debtService.createDebt(user.userId, body);

      logger.info(`创建借贷记录成功`, { userId: user.userId, debtId: debt.id });
      return c.json({ debt, message: '借贷记录创建成功' }, 201);
    } catch (error) {
      logger.error(`创建借贷记录失败`, error as Error, { userId: user.userId });
      return c.json({ error: '创建借贷记录失败' }, 500);
    }
  }

  // 更新借贷记录
  async updateDebt(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      const body = await c.req.json<Partial<DebtRequest>>();

      logger.info(`更新借贷记录`, { userId: user.userId, id, body });
      const debt = await debtService.updateDebt(user.userId, id, body);

      if (!debt) {
        logger.warn(`借贷记录不存在`, { userId: user.userId, id });
        return c.json({ error: '借贷记录不存在' }, 404);
      }

      logger.info(`更新借贷记录成功`, { userId: user.userId, id });
      return c.json({ debt, message: '借贷记录更新成功' });
    } catch (error) {
      logger.error(`更新借贷记录失败`, error as Error, { userId: user.userId, id });
      return c.json({ error: '更新借贷记录失败' }, 500);
    }
  }

  // 删除借贷记录
  async deleteDebt(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      logger.info(`删除借贷记录`, { userId: user.userId, id });
      const deleted = await debtService.deleteDebt(user.userId, id);

      if (!deleted) {
        logger.warn(`借贷记录不存在`, { userId: user.userId, id });
        return c.json({ error: '借贷记录不存在' }, 404);
      }

      logger.info(`删除借贷记录成功`, { userId: user.userId, id });
      return c.json({ message: '借贷记录删除成功' });
    } catch (error) {
      logger.error(`删除借贷记录失败`, error as Error, { userId: user.userId, id });
      return c.json({ error: '删除借贷记录失败' }, 500);
    }
  }

  // 记录还款
  async repay(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      const body = await c.req.json<RepayRequest>();

      if (!body.amount || body.amount <= 0) {
        logger.warn(`还款金额错误`, { userId: user.userId, id, amount: body.amount });
        return c.json({ error: '还款金额必须大于0' }, 400);
      }

      logger.info(`记录还款`, { userId: user.userId, id, amount: body.amount });
      const debt = await debtService.repay(user.userId, id, body);

      if (!debt) {
        logger.warn(`借贷记录不存在`, { userId: user.userId, id });
        return c.json({ error: '借贷记录不存在' }, 404);
      }

      logger.info(`还款成功`, { userId: user.userId, id, amount: body.amount });
      return c.json({ debt, message: '还款成功' });
    } catch (error) {
      if (error instanceof Error && error.message === '还款金额不能超过借款金额') {
        return c.json({ error: '还款金额不能超过借款金额' }, 400);
      }
      logger.error(`还款失败`, error as Error, { userId: user.userId, id });
      return c.json({ error: '还款失败' }, 500);
    }
  }

  // 获取借贷统计
  async getSummary(c: Context) {
    const user = c.get('user');

    try {
      logger.info(`获取借贷统计`, { userId: user.userId });
      const summary = await debtService.getSummary(user.userId);
      return c.json({ summary });
    } catch (error) {
      logger.error(`获取借贷统计失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取借贷统计失败' }, 500);
    }
  }
}

export const debtController = new DebtController();
