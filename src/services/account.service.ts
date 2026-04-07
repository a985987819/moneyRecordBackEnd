import { db } from '../config/database';
import type {
  AccountRequest,
  AccountResponse,
  AdjustBalanceRequest,
  AccountSummary,
} from '../types/account';
import { safeParseFloat } from '../utils/validation';

export class AccountService {
  // 获取所有账户
  async getAllAccounts(userId: number): Promise<AccountResponse[]> {
    const result = await db.query(
      `SELECT id::text, name, type, icon, balance, initial_balance, is_default, color,
              TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
              TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at
       FROM accounts
       WHERE user_id = $1
       ORDER BY is_default DESC, created_at DESC`,
      [userId]
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      icon: row.icon,
      balance: safeParseFloat(row.balance, 0),
      initialBalance: safeParseFloat(row.initial_balance, 0),
      isDefault: row.is_default,
      color: row.color,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  // 创建账户
  async createAccount(userId: number, data: AccountRequest): Promise<AccountResponse> {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      // 如果设置为默认账户，先取消其他默认账户
      if (data.isDefault) {
        await client.query(
          `UPDATE accounts SET is_default = FALSE WHERE user_id = $1`,
          [userId]
        );
      }

      const result = await client.query(
        `INSERT INTO accounts
         (name, type, icon, balance, initial_balance, is_default, color, user_id)
         VALUES ($1, $2, $3, $4, $4, $5, $6, $7)
         RETURNING id::text, name, type, icon, balance, initial_balance, is_default, color,
                   TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                   TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
        [
          data.name,
          data.type,
          data.icon,
          data.initialBalance,
          data.isDefault || false,
          data.color || null,
          userId,
        ]
      );

      await client.query('COMMIT');

      const row = result.rows[0];
      if (!row) {
        throw new Error('账户创建失败');
      }
      return {
        id: row.id,
        name: row.name,
        type: row.type,
        icon: row.icon,
        balance: safeParseFloat(row.balance, 0),
        initialBalance: safeParseFloat(row.initial_balance, 0),
        isDefault: row.is_default,
        color: row.color,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // 更新账户
  async updateAccount(
    userId: number,
    id: string,
    data: Partial<AccountRequest>
  ): Promise<AccountResponse | null> {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      // 如果设置为默认账户，先取消其他默认账户
      if (data.isDefault) {
        await client.query(
          `UPDATE accounts SET is_default = FALSE WHERE user_id = $1 AND id != $2`,
          [userId, id]
        );
      }

      const result = await client.query(
        `UPDATE accounts
         SET name = COALESCE($1, name),
             type = COALESCE($2, type),
             icon = COALESCE($3, icon),
             is_default = COALESCE($4, is_default),
             color = COALESCE($5, color),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $6 AND user_id = $7
         RETURNING id::text, name, type, icon, balance, initial_balance, is_default, color,
                   TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                   TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
        [
          data.name,
          data.type,
          data.icon,
          data.isDefault,
          data.color,
          id,
          userId,
        ]
      );

      await client.query('COMMIT');

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        type: row.type,
        icon: row.icon,
        balance: safeParseFloat(row.balance, 0),
        initialBalance: safeParseFloat(row.initial_balance, 0),
        isDefault: row.is_default,
        color: row.color,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // 删除账户
  async deleteAccount(userId: number, id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM accounts WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // 调整余额
  async adjustBalance(
    userId: number,
    id: string,
    data: AdjustBalanceRequest
  ): Promise<AccountResponse | null> {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE accounts
         SET balance = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND user_id = $3
         RETURNING id::text, name, type, icon, balance, initial_balance, is_default, color,
                   TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                   TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
        [data.newBalance, id, userId]
      );

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      // 记录余额调整历史
      await client.query(
        `INSERT INTO account_adjustments (account_id, new_balance, remark, user_id)
         VALUES ($1, $2, $3, $4)`,
        [id, data.newBalance, data.remark || null, userId]
      );

      await client.query('COMMIT');

      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        type: row.type,
        icon: row.icon,
        balance: safeParseFloat(row.balance, 0),
        initialBalance: safeParseFloat(row.initial_balance, 0),
        isDefault: row.is_default,
        color: row.color,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // 获取账户统计
  async getSummary(userId: number): Promise<AccountSummary> {
    const result = await db.query(
      `SELECT
        COALESCE(SUM(balance) FILTER (WHERE type != 'credit'), 0) as total_assets,
        COALESCE(SUM(balance) FILTER (WHERE type = 'credit'), 0) as total_liabilities,
        COALESCE(SUM(balance), 0) as net_worth
       FROM accounts
       WHERE user_id = $1`,
      [userId]
    );

    // 按类型统计
    const byTypeResult = await db.query(
      `SELECT type, COALESCE(SUM(balance), 0) as total
       FROM accounts
       WHERE user_id = $1
       GROUP BY type`,
      [userId]
    );

    const byType: Record<string, number> = {};
    byTypeResult.rows.forEach((row) => {
      byType[row.type] = safeParseFloat(row.total, 0);
    });

    const row = result.rows[0];
    if (!row) {
      return {
        totalAssets: 0,
        totalLiabilities: 0,
        netWorth: 0,
        byType,
      };
    }
    return {
      totalAssets: safeParseFloat(row.total_assets, 0),
      totalLiabilities: safeParseFloat(row.total_liabilities, 0),
      netWorth: safeParseFloat(row.net_worth, 0),
      byType,
    };
  }
}

export const accountService = new AccountService();
