import { accountService } from '../services/account.service';
import { logger } from '../utils/logger';
import type { AuthContext } from '../middleware/auth.middleware';
import type { AccountRequest, AdjustBalanceRequest } from '../types/account';

export class AccountController {
  // 获取所有账户
  async getAllAccounts(c: AuthContext) {
    const user = c.get('user');

    try {
      logger.info(`获取账户列表`, { userId: user.userId });
      const accounts = await accountService.getAllAccounts(user.userId);
      return c.json({ accounts });
    } catch (error) {
      logger.error(`获取账户列表失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取账户列表失败' }, 500);
    }
  }

  // 创建账户
  async createAccount(c: AuthContext) {
    const user = c.get('user');

    try {
      const body = await c.req.json<AccountRequest>();

      if (!body.name || !body.type || !body.icon) {
        logger.warn(`创建账户参数错误`, { userId: user.userId, body });
        return c.json({ error: '账户名称、类型和图标不能为空' }, 400);
      }

      logger.info(`创建账户`, { userId: user.userId, body });
      const account = await accountService.createAccount(user.userId, body);

      logger.info(`创建账户成功`, { userId: user.userId, accountId: account.id });
      return c.json({ account, message: '账户创建成功' }, 201);
    } catch (error) {
      logger.error(`创建账户失败`, error as Error, { userId: user.userId });
      return c.json({ error: '创建账户失败' }, 500);
    }
  }

  // 更新账户
  async updateAccount(c: AuthContext) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      const body = await c.req.json<Partial<AccountRequest>>();

      logger.info(`更新账户`, { userId: user.userId, id, body });
      const account = await accountService.updateAccount(user.userId, id, body);

      if (!account) {
        logger.warn(`账户不存在`, { userId: user.userId, id });
        return c.json({ error: '账户不存在' }, 404);
      }

      logger.info(`更新账户成功`, { userId: user.userId, id });
      return c.json({ account, message: '账户更新成功' });
    } catch (error) {
      logger.error(`更新账户失败`, error as Error, { userId: user.userId, id });
      return c.json({ error: '更新账户失败' }, 500);
    }
  }

  // 删除账户
  async deleteAccount(c: AuthContext) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      logger.info(`删除账户`, { userId: user.userId, id });
      const deleted = await accountService.deleteAccount(user.userId, id);

      if (!deleted) {
        logger.warn(`账户不存在`, { userId: user.userId, id });
        return c.json({ error: '账户不存在' }, 404);
      }

      logger.info(`删除账户成功`, { userId: user.userId, id });
      return c.json({ message: '账户删除成功' });
    } catch (error) {
      logger.error(`删除账户失败`, error as Error, { userId: user.userId, id });
      return c.json({ error: '删除账户失败' }, 500);
    }
  }

  // 调整余额
  async adjustBalance(c: AuthContext) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      const body = await c.req.json<AdjustBalanceRequest>();

      if (body.newBalance === undefined) {
        logger.warn(`调整余额参数错误`, { userId: user.userId, id, body });
        return c.json({ error: '新余额不能为空' }, 400);
      }

      logger.info(`调整账户余额`, { userId: user.userId, id, newBalance: body.newBalance });
      const account = await accountService.adjustBalance(user.userId, id, body);

      if (!account) {
        logger.warn(`账户不存在`, { userId: user.userId, id });
        return c.json({ error: '账户不存在' }, 404);
      }

      logger.info(`调整余额成功`, { userId: user.userId, id });
      return c.json({ account, message: '余额调整成功' });
    } catch (error) {
      logger.error(`调整余额失败`, error as Error, { userId: user.userId, id });
      return c.json({ error: '调整余额失败' }, 500);
    }
  }

  // 获取账户统计
  async getSummary(c: AuthContext) {
    const user = c.get('user');

    try {
      logger.info(`获取账户统计`, { userId: user.userId });
      const summary = await accountService.getSummary(user.userId);
      return c.json({ summary });
    } catch (error) {
      logger.error(`获取账户统计失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取账户统计失败' }, 500);
    }
  }
}

export const accountController = new AccountController();
