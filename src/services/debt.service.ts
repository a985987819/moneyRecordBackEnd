import { db } from '../config/database';
import type { DebtRequest, DebtResponse, DebtSummary, RepayRequest } from '../types/debt';
import { BaseService } from '../utils/base.service';

export class DebtService extends BaseService {
  private mapToResponse(row: Record<string, any>): DebtResponse {
    const amount = this.getFloat(row, 'amount', 0);
    const repaidAmount = this.getFloat(row, 'repaid_amount', 0);
    return {
      id: row.id,
      type: row.type,
      personName: row.person_name,
      amount,
      repaidAmount,
      remainingAmount: this.getFloat(row, 'remaining_amount', 0),
      date: row.date,
      expectedRepayDate: row.expected_repay_date,
      remark: row.remark,
      status: row.status,
      progress: amount > 0 ? (repaidAmount / amount) * 100 : 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
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

    return result.rows.map((row) => this.mapToResponse(row));
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
    if (!row) {
      throw new Error('借贷记录创建失败');
    }
    return this.mapToResponse(row);
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

    return this.mapToResponse(result.rows[0]);
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
      return this.mapToResponse(row);
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
    if (!row) {
      return {
        totalLend: 0,
        totalBorrow: 0,
        netLend: 0,
        pendingLend: 0,
        pendingBorrow: 0,
        repaidLend: 0,
        repaidBorrow: 0,
      };
    }
    const totalLend = this.getFloat(row, 'total_lend', 0);
    const totalBorrow = this.getFloat(row, 'total_borrow', 0);

    return {
      totalLend,
      totalBorrow,
      netLend: totalLend - totalBorrow,
      pendingLend: this.getFloat(row, 'pending_lend', 0),
      pendingBorrow: this.getFloat(row, 'pending_borrow', 0),
      repaidLend: this.getFloat(row, 'repaid_lend', 0),
      repaidBorrow: this.getFloat(row, 'repaid_borrow', 0),
    };
  }
}

export const debtService = new DebtService();
