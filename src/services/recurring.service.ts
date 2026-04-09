import { db } from '../config/database';
import type {
  RecurringRecordRequest,
  RecurringRecordResponse,
  RecurringSummary,
} from '../types/recurring';
import { BaseService } from '../utils/base.service';

export class RecurringService extends BaseService {
  private mapToResponse(row: Record<string, any>): RecurringRecordResponse {
    return this.mapRowToResponse<RecurringRecordResponse>(
      row,
      {
        id: row.id,
        type: row.type,
        category: row.category,
        subCategory: row.sub_category,
        categoryIcon: row.category_icon,
        amount: this.getFloat(row, 'amount'),
        remark: row.remark,
        frequency: row.frequency,
        startDate: row.start_date,
        endDate: row.end_date,
        nextExecuteDate: row.next_execute_date,
        account: row.account,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    );
  }

  // 计算下一次执行日期
  private calculateNextDate(date: Date, frequency: string): Date {
    const next = new Date(date);
    switch (frequency) {
      case 'daily': next.setDate(next.getDate() + 1); break;
      case 'weekly': next.setDate(next.getDate() + 7); break;
      case 'monthly': next.setMonth(next.getMonth() + 1); break;
      case 'yearly': next.setFullYear(next.getFullYear() + 1); break;
    }
    return next;
  }

  // 获取所有周期记账
  async getAllRecurring(userId: number): Promise<RecurringRecordResponse[]> {
    const result = await db.query(
      `SELECT id::text, type, category, sub_category, category_icon, amount, remark,
              frequency, start_date, end_date, next_execute_date, account, is_active,
              TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
              TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at
       FROM recurring_records
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows.map((row) => this.mapToResponse(row));
  }

  // 创建周期记账
  async createRecurring(
    userId: number,
    data: RecurringRecordRequest
  ): Promise<RecurringRecordResponse> {
    const nextExecuteDate = this.calculateNextDate(new Date(data.startDate), data.frequency);

    const result = await db.query(
      `INSERT INTO recurring_records
       (type, category, sub_category, category_icon, amount, remark, frequency,
        start_date, end_date, next_execute_date, account, is_active, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, TRUE, $12)
       RETURNING id::text, type, category, sub_category, category_icon, amount, remark,
                 frequency, start_date, end_date, next_execute_date, account, is_active,
                 TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                 TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
      [
        data.type,
        data.category,
        data.subCategory || null,
        data.categoryIcon || '📦',
        data.amount,
        data.remark,
        data.frequency,
        data.startDate,
        data.endDate || null,
        nextExecuteDate.toISOString().split('T')[0],
        data.account,
        userId,
      ]
    );

    return this.mapToResponse(result.rows[0]);
  }

  // 更新周期记账
  async updateRecurring(
    userId: number,
    id: string,
    data: Partial<RecurringRecordRequest>
  ): Promise<RecurringRecordResponse | null> {
    // 如果更新了频率或开始日期，需要重新计算下次执行日期
    let nextExecuteDate: string | undefined;
    if (data.frequency || data.startDate) {
      const current = await db.query(
        `SELECT frequency, start_date FROM recurring_records WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );
      if (current.rows.length > 0) {
        const frequency = data.frequency || current.rows[0].frequency;
        const startDate = data.startDate || current.rows[0].start_date;
        nextExecuteDate = this.calculateNextDate(new Date(startDate), frequency)
          .toISOString()
          .split('T')[0];
      }
    }

    const result = await db.query(
      `UPDATE recurring_records
       SET type = COALESCE($1, type),
           category = COALESCE($2, category),
           sub_category = COALESCE($3, sub_category),
           category_icon = COALESCE($4, category_icon),
           amount = COALESCE($5, amount),
           remark = COALESCE($6, remark),
           frequency = COALESCE($7, frequency),
           start_date = COALESCE($8, start_date),
           end_date = COALESCE($9, end_date),
           next_execute_date = COALESCE($10, next_execute_date),
           account = COALESCE($11, account),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $12 AND user_id = $13
       RETURNING id::text, type, category, sub_category, category_icon, amount, remark,
                 frequency, start_date, end_date, next_execute_date, account, is_active,
                 TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                 TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
      [
        data.type,
        data.category,
        data.subCategory,
        data.categoryIcon,
        data.amount,
        data.remark,
        data.frequency,
        data.startDate,
        data.endDate,
        nextExecuteDate,
        data.account,
        id,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToResponse(result.rows[0]);
  }

  // 删除周期记账
  async deleteRecurring(userId: number, id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM recurring_records WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // 切换启用/禁用状态
  async toggleRecurring(userId: number, id: string): Promise<RecurringRecordResponse | null> {
    const result = await db.query(
      `UPDATE recurring_records
       SET is_active = NOT is_active,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING id::text, type, category, sub_category, category_icon, amount, remark,
                 frequency, start_date, end_date, next_execute_date, account, is_active,
                 TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                 TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToResponse(result.rows[0]);
  }

  // 获取统计
  async getSummary(userId: number): Promise<RecurringSummary> {
    const result = await db.query(
      `SELECT
        COUNT(*) FILTER (WHERE is_active = TRUE) as total_active,
        COUNT(*) FILTER (WHERE is_active = FALSE) as total_inactive,
        COALESCE(SUM(amount) FILTER (WHERE is_active = TRUE AND frequency = 'monthly'), 0) as monthly_total
       FROM recurring_records
       WHERE user_id = $1`,
      [userId]
    );

    const row = result.rows[0];
    return {
      totalActive: this.getInt(row, 'total_active'),
      totalInactive: this.getInt(row, 'total_inactive'),
      monthlyTotal: this.getFloat(row, 'monthly_total'),
    };
  }
}

export const recurringService = new RecurringService();
