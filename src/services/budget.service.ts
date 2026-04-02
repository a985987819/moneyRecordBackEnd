import { db } from '../config/database';
import type { Budget, BudgetRequest, BudgetResponse, BudgetStats } from '../types/budget';

export class BudgetService {
  // 获取指定月份的预算
  async getBudget(userId: number, year: number, month: number): Promise<BudgetResponse | null> {
    const result = await db.query(
      `SELECT id::text, year, month, amount, spent,
              (amount - spent) as remaining,
              CASE WHEN amount > 0 THEN (spent / amount * 100) ELSE 0 END as percentage
       FROM budgets
       WHERE user_id = $1 AND year = $2 AND month = $3`,
      [userId, year, month]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      year: row.year,
      month: row.month,
      amount: parseFloat(row.amount),
      spent: parseFloat(row.spent),
      remaining: parseFloat(row.remaining),
      percentage: parseFloat(row.percentage),
    };
  }

  // 创建或更新预算
  async setBudget(userId: number, data: BudgetRequest): Promise<BudgetResponse> {
    const now = new Date();
    const year = data.year || now.getFullYear();
    const month = data.month || now.getMonth() + 1;

    // 检查是否已存在该月预算
    const existing = await db.query(
      `SELECT id FROM budgets WHERE user_id = $1 AND year = $2 AND month = $3`,
      [userId, year, month]
    );

    let result;
    if (existing.rows.length > 0) {
      // 更新现有预算
      result = await db.query(
        `UPDATE budgets
         SET amount = $1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2 AND year = $3 AND month = $4
         RETURNING id::text, year, month, amount, spent,
                   (amount - spent) as remaining,
                   CASE WHEN amount > 0 THEN (spent / amount * 100) ELSE 0 END as percentage`,
        [data.amount, userId, year, month]
      );
    } else {
      // 创建新预算
      result = await db.query(
        `INSERT INTO budgets (year, month, amount, spent, user_id)
         VALUES ($1, $2, $3, 0, $4)
         RETURNING id::text, year, month, amount, spent,
                   (amount - spent) as remaining,
                   CASE WHEN amount > 0 THEN (spent / amount * 100) ELSE 0 END as percentage`,
        [year, month, data.amount, userId]
      );
    }

    const row = result.rows[0];
    return {
      id: row.id,
      year: row.year,
      month: row.month,
      amount: parseFloat(row.amount),
      spent: parseFloat(row.spent),
      remaining: parseFloat(row.remaining),
      percentage: parseFloat(row.percentage),
    };
  }

  // 更新预算支出（记账时调用）
  async updateSpent(userId: number, year: number, month: number, amount: number, isExpense: boolean): Promise<void> {
    // 检查该月是否有预算
    const existing = await db.query(
      `SELECT id FROM budgets WHERE user_id = $1 AND year = $2 AND month = $3`,
      [userId, year, month]
    );

    if (existing.rows.length === 0) {
      // 没有预算记录，自动创建一个默认预算（金额为0）
      await db.query(
        `INSERT INTO budgets (year, month, amount, spent, user_id)
         VALUES ($1, $2, 0, $3, $4)
         ON CONFLICT (user_id, year, month) DO UPDATE
         SET spent = budgets.spent + $3, updated_at = CURRENT_TIMESTAMP`,
        [year, month, isExpense ? amount : -amount, userId]
      );
    } else {
      // 更新支出
      await db.query(
        `UPDATE budgets
         SET spent = spent + $1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2 AND year = $3 AND month = $4`,
        [isExpense ? amount : -amount, userId, year, month]
      );
    }
  }

  // 删除预算
  async deleteBudget(userId: number, year: number, month: number): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM budgets WHERE user_id = $1 AND year = $2 AND month = $3 RETURNING id`,
      [userId, year, month]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // 获取预算统计
  async getBudgetStats(userId: number): Promise<BudgetStats> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // 获取当前月预算
    const currentMonthBudget = await this.getBudget(userId, currentYear, currentMonth);

    // 获取上月预算
    let lastYear = currentYear;
    let lastMonth = currentMonth - 1;
    if (lastMonth === 0) {
      lastMonth = 12;
      lastYear--;
    }
    const lastMonthBudget = await this.getBudget(userId, lastYear, lastMonth);

    // 计算平均支出（最近6个月）
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const avgResult = await db.query(
      `SELECT COALESCE(AVG(spent), 0) as average_spent
       FROM budgets
       WHERE user_id = $1 AND
             (year > $2 OR (year = $2 AND month >= $3))`,
      [userId, sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + 1]
    );

    return {
      currentMonth: currentMonthBudget,
      lastMonth: lastMonthBudget,
      averageSpent: parseFloat(avgResult.rows[0]?.average_spent || 0),
    };
  }

  // 获取最近几个月的预算列表
  async getRecentBudgets(userId: number, months: number = 6): Promise<BudgetResponse[]> {
    const now = new Date();
    const budgets: BudgetResponse[] = [];

    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const budget = await this.getBudget(userId, year, month);
      if (budget) {
        budgets.push(budget);
      }
    }

    return budgets;
  }
}

export const budgetService = new BudgetService();
