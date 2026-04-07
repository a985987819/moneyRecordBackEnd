import { db } from '../config/database';
import type {
  SavingsGoalRequest,
  SavingsGoalResponse,
  DepositRequest,
  WithdrawRequest,
  SavingsSummary,
} from '../types/savings';
import { safeParseFloat, safePercentage } from '../utils/validation';

export class SavingsService {
  // 获取所有储蓄目标
  async getAllGoals(userId: number): Promise<SavingsGoalResponse[]> {
    const result = await db.query(
      `SELECT id::text, name, target_amount, current_amount, deadline,
              icon, color, status,
              TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
              TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at
       FROM savings_goals
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      targetAmount: safeParseFloat(row.target_amount, 0),
      currentAmount: safeParseFloat(row.current_amount, 0),
      deadline: row.deadline,
      icon: row.icon,
      color: row.color,
      status: row.status,
      progress: safePercentage(safeParseFloat(row.current_amount, 0), safeParseFloat(row.target_amount, 0)),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  // 创建储蓄目标
  async createGoal(userId: number, data: SavingsGoalRequest): Promise<SavingsGoalResponse> {
    const result = await db.query(
      `INSERT INTO savings_goals (name, target_amount, current_amount, deadline, icon, color, status, user_id)
       VALUES ($1, $2, 0, $3, $4, $5, 'active', $6)
       RETURNING id::text, name, target_amount, current_amount, deadline,
                 icon, color, status,
                 TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                 TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
      [data.name, data.targetAmount, data.deadline || null, data.icon, data.color, userId]
    );

    const row = result.rows[0];
    if (!row) {
      throw new Error('储蓄目标创建失败');
    }
    return {
      id: row.id,
      name: row.name,
      targetAmount: safeParseFloat(row.target_amount, 0),
      currentAmount: safeParseFloat(row.current_amount, 0),
      deadline: row.deadline,
      icon: row.icon,
      color: row.color,
      status: row.status,
      progress: 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // 更新储蓄目标
  async updateGoal(
    userId: number,
    goalId: string,
    data: Partial<SavingsGoalRequest>
  ): Promise<SavingsGoalResponse | null> {
    const result = await db.query(
      `UPDATE savings_goals
       SET name = COALESCE($1, name),
           target_amount = COALESCE($2, target_amount),
           deadline = COALESCE($3, deadline),
           icon = COALESCE($4, icon),
           color = COALESCE($5, color),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 AND user_id = $7
       RETURNING id::text, name, target_amount, current_amount, deadline,
                 icon, color, status,
                 TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                 TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
      [data.name, data.targetAmount, data.deadline, data.icon, data.color, goalId, userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      targetAmount: safeParseFloat(row.target_amount, 0),
      currentAmount: safeParseFloat(row.current_amount, 0),
      deadline: row.deadline,
      icon: row.icon,
      color: row.color,
      status: row.status,
      progress: safePercentage(safeParseFloat(row.current_amount, 0), safeParseFloat(row.target_amount, 0)),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // 删除储蓄目标
  async deleteGoal(userId: number, goalId: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM savings_goals WHERE id = $1 AND user_id = $2 RETURNING id`,
      [goalId, userId]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // 向目标存钱
  async deposit(
    userId: number,
    goalId: string,
    data: DepositRequest
  ): Promise<SavingsGoalResponse | null> {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      // 更新目标金额
      const result = await client.query(
        `UPDATE savings_goals
         SET current_amount = current_amount + $1,
             status = CASE
               WHEN current_amount + $1 >= target_amount THEN 'completed'
               ELSE status
             END,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND user_id = $3
         RETURNING id::text, name, target_amount, current_amount, deadline,
                   icon, color, status,
                   TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                   TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
        [data.amount, goalId, userId]
      );

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      // 记录存款历史
      await client.query(
        `INSERT INTO savings_transactions (goal_id, type, amount, remark, user_id)
         VALUES ($1, 'deposit', $2, $3, $4)`,
        [goalId, data.amount, data.remark || null, userId]
      );

      await client.query('COMMIT');

      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        targetAmount: safeParseFloat(row.target_amount, 0),
        currentAmount: safeParseFloat(row.current_amount, 0),
        deadline: row.deadline,
        icon: row.icon,
        color: row.color,
        status: row.status,
        progress: safePercentage(safeParseFloat(row.current_amount, 0), safeParseFloat(row.target_amount, 0)),
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

  // 从目标取钱
  async withdraw(
    userId: number,
    goalId: string,
    data: WithdrawRequest
  ): Promise<SavingsGoalResponse | null> {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      // 检查余额是否足够
      const checkResult = await client.query(
        `SELECT current_amount FROM savings_goals WHERE id = $1 AND user_id = $2`,
        [goalId, userId]
      );

      if (checkResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      const currentAmount = parseFloat(checkResult.rows[0].current_amount);
      if (currentAmount < data.amount) {
        await client.query('ROLLBACK');
        throw new Error('余额不足');
      }

      // 更新目标金额
      const result = await client.query(
        `UPDATE savings_goals
         SET current_amount = current_amount - $1,
             status = CASE
               WHEN status = 'completed' AND current_amount - $1 < target_amount THEN 'active'
               ELSE status
             END,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND user_id = $3
         RETURNING id::text, name, target_amount, current_amount, deadline,
                   icon, color, status,
                   TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                   TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
        [data.amount, goalId, userId]
      );

      // 记录取款历史
      await client.query(
        `INSERT INTO savings_transactions (goal_id, type, amount, remark, user_id)
         VALUES ($1, 'withdraw', $2, $3, $4)`,
        [goalId, data.amount, data.remark || null, userId]
      );

      await client.query('COMMIT');

      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        targetAmount: safeParseFloat(row.target_amount, 0),
        currentAmount: safeParseFloat(row.current_amount, 0),
        deadline: row.deadline,
        icon: row.icon,
        color: row.color,
        status: row.status,
        progress: safePercentage(safeParseFloat(row.current_amount, 0), safeParseFloat(row.target_amount, 0)),
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

  // 获取储蓄统计
  async getSummary(userId: number): Promise<SavingsSummary> {
    const result = await db.query(
      `SELECT
        COUNT(*) as total_goals,
        COUNT(*) FILTER (WHERE status = 'active') as active_goals,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_goals,
        COALESCE(SUM(target_amount), 0) as total_target,
        COALESCE(SUM(current_amount), 0) as total_saved
       FROM savings_goals
       WHERE user_id = $1`,
      [userId]
    );

    const row = result.rows[0];
    if (!row) {
      return {
        totalGoals: 0,
        activeGoals: 0,
        completedGoals: 0,
        totalTarget: 0,
        totalSaved: 0,
      };
    }
    return {
      totalGoals: safeParseFloat(row.total_goals, 0),
      activeGoals: safeParseFloat(row.active_goals, 0),
      completedGoals: safeParseFloat(row.completed_goals, 0),
      totalTarget: safeParseFloat(row.total_target, 0),
      totalSaved: safeParseFloat(row.total_saved, 0),
    };
  }
}

export const savingsService = new SavingsService();
