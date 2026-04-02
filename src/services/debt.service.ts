import { db } from '../config/database';
import type { Debt, DebtRequest, DebtResponse, RepayRequest, DebtSummary } from '../types/debt';

export class DebtService {
  // 获取所有借贷记录
  async getAllDebts(userId: number): Promise<DebtResponse[]> {
    const result = await db.query(
      `SELECT id::text, type, person_name, amount, repaid_amount, remaining_amount,
              date, expected_repay_date, remark, status,
              TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
              TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at
       FROM debts
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows.map((row) => ({
      id: row.id,
      type: row.type,
      personName: row.person_name,
      amount: parseFloat(row.amount),
      repaidAmount: parseFloat(row.repaid_amount),
      remainingAmount: parseFloat(row.remaining_amount),
      date: row.date,
      expectedRepayDate: row.expected_repay_date,
      remark: row.remark,
      status: row.status,
      progress: parseFloat(row.amount) > 0
        ? Math.min(100, (parseFloat(row.repaid_amount) / parseFloat(row.amount)) * 100)
        : 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  // 创建借贷记录
  async createDebt(userId: number, data: DebtRequest): Promise<DebtResponse> {
    const result = await db.query(
      `INSERT INTO debts
       (type, person_name, amount, repaid_amount, remaining_amount, date,
        expected_repay_date, remark, status, user_id)
       VALUES ($1, $2, $3, 0, $3, $4, $5, $6, 'pending', $7)
       RETURNING id::text, type, person_name, amount, repaid_amount, remaining_amount,
                 date, expected_repay_date, remark, status,
                 TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                 TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
      [
        data.type,
        data.personName,
        data.amount,
        data.date,
        data.expectedRepayDate || null,
        data.remark || null,
        userId,
      ]
    );

    const row = result.rows[0];
    return {
      id: row.id,
      type: row.type,
      personName: row.person_name,
      amount: parseFloat(row.amount),
      repaidAmount: parseFloat(row.repaid_amount),
      remainingAmount: parseFloat(row.remaining_amount),
      date: row.date,
      expectedRepayDate: row.expected_repay_date,
      remark: row.remark,
      status: row.status,
      progress: 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // 更新借贷记录
  async updateDebt(
    userId: number,
    id: string,
    data: Partial<DebtRequest>
  ): Promise<DebtResponse | null> {
    const result = await db.query(
      `UPDATE debts
       SET type = COALESCE($1, type),
           person_name = COALESCE($2, person_name),
           amount = COALESCE($3, amount),
           date = COALESCE($4, date),
           expected_repay_date = COALESCE($5, expected_repay_date),
           remark = COALESCE($6, remark),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8
       RETURNING id::text, type, person_name, amount, repaid_amount, remaining_amount,
                 date, expected_repay_date, remark, status,
                 TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                 TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
      [
        data.type,
        data.personName,
        data.amount,
        data.date,
        data.expectedRepayDate,
        data.remark,
        id,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      type: row.type,
      personName: row.person_name,
      amount: parseFloat(row.amount),
      repaidAmount: parseFloat(row.repaid_amount),
      remainingAmount: parseFloat(row.remaining_amount),
      date: row.date,
      expectedRepayDate: row.expected_repay_date,
      remark: row.remark,
      status: row.status,
      progress: parseFloat(row.amount) > 0
        ? Math.min(100, (parseFloat(row.repaid_amount) / parseFloat(row.amount)) * 100)
        : 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // 删除借贷记录
  async deleteDebt(userId: number, id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM debts WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // 记录还款
  async repay(userId: number, id: string, data: RepayRequest): Promise<DebtResponse | null> {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      // 获取当前借贷信息
      const currentResult = await client.query(
        `SELECT amount, repaid_amount FROM debts WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );

      if (currentResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      const amount = parseFloat(currentResult.rows[0].amount);
      const repaidAmount = parseFloat(currentResult.rows[0].repaid_amount);
      const newRepaidAmount = repaidAmount + data.amount;

      if (newRepaidAmount > amount) {
        await client.query('ROLLBACK');
        throw new Error('还款金额不能超过借款金额');
      }

      const remainingAmount = amount - newRepaidAmount;
      let status: string;
      if (remainingAmount === 0) {
        status = 'repaid';
      } else if (newRepaidAmount > 0) {
        status = 'partial';
      } else {
        status = 'pending';
      }

      const result = await client.query(
        `UPDATE debts
         SET repaid_amount = $1,
             remaining_amount = $2,
             status = $3,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4 AND user_id = $5
         RETURNING id::text, type, person_name, amount, repaid_amount, remaining_amount,
                   date, expected_repay_date, remark, status,
                   TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                   TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
        [newRepaidAmount, remainingAmount, status, id, userId]
      );

      // 记录还款历史
      await client.query(
        `INSERT INTO debt_repayments (debt_id, amount, remark, user_id)
         VALUES ($1, $2, $3, $4)`,
        [id, data.amount, data.remark || null, userId]
      );

      await client.query('COMMIT');

      const row = result.rows[0];
      return {
        id: row.id,
        type: row.type,
        personName: row.person_name,
        amount: parseFloat(row.amount),
        repaidAmount: parseFloat(row.repaid_amount),
        remainingAmount: parseFloat(row.remaining_amount),
        date: row.date,
        expectedRepayDate: row.expected_repay_date,
        remark: row.remark,
        status: row.status,
        progress: parseFloat(row.amount) > 0
          ? Math.min(100, (parseFloat(row.repaid_amount) / parseFloat(row.amount)) * 100)
          : 0,
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

  // 获取借贷统计
  async getSummary(userId: number): Promise<DebtSummary> {
    const result = await db.query(
      `SELECT
        COALESCE(SUM(amount) FILTER (WHERE type = 'lend'), 0) as total_lend,
        COALESCE(SUM(amount) FILTER (WHERE type = 'borrow'), 0) as total_borrow,
        COALESCE(SUM(remaining_amount) FILTER (WHERE type = 'lend'), 0) as pending_lend,
        COALESCE(SUM(remaining_amount) FILTER (WHERE type = 'borrow'), 0) as pending_borrow,
        COALESCE(SUM(repaid_amount) FILTER (WHERE type = 'lend'), 0) as repaid_lend,
        COALESCE(SUM(repaid_amount) FILTER (WHERE type = 'borrow'), 0) as repaid_borrow
       FROM debts
       WHERE user_id = $1`,
      [userId]
    );

    const row = result.rows[0];
    const totalLend = parseFloat(row.total_lend);
    const totalBorrow = parseFloat(row.total_borrow);

    return {
      totalLend,
      totalBorrow,
      netLend: totalLend - totalBorrow,
      pendingLend: parseFloat(row.pending_lend),
      pendingBorrow: parseFloat(row.pending_borrow),
      repaidLend: parseFloat(row.repaid_lend),
      repaidBorrow: parseFloat(row.repaid_borrow),
    };
  }
}

export const debtService = new DebtService();
