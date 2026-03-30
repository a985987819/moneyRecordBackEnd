import { db } from '../config/database';
import type { RecordItem, RecordRequest, MonthlyStats, RecordQueryParams } from '../types/record';

export class RecordService {
  async getMonthlyStats(userId: number, month?: string): Promise<MonthlyStats> {
    const targetMonth = month || new Date().toISOString().slice(0, 7);
    
    const result = await db.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income
       FROM records 
       WHERE user_id = $1 AND TO_CHAR(date, 'YYYY-MM') = $2`,
      [userId, targetMonth]
    );

    const { total_expense, total_income } = result.rows[0];
    
    return {
      totalExpense: parseFloat(total_expense),
      totalIncome: parseFloat(total_income),
      budget: 5000,
    };
  }

  async getRecentRecords(userId: number): Promise<RecordItem[]> {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const result = await db.query(
      `SELECT 
        id::text, type, category, category_icon as "categoryIcon", 
        amount, remark, date::text, account
       FROM records 
       WHERE user_id = $1 AND date >= $2
       ORDER BY date DESC, created_at DESC
       LIMIT 50`,
      [userId, threeDaysAgo.toISOString().split('T')[0]]
    );
    
    return result.rows;
  }

  async getRecords(userId: number, params?: RecordQueryParams): Promise<RecordItem[]> {
    let query = `
      SELECT 
        id::text, type, category, category_icon as "categoryIcon", 
        amount, remark, date::text, account
      FROM records 
      WHERE user_id = $1
    `;
    const queryParams: any[] = [userId];
    let paramIndex = 2;

    if (params?.startDate) {
      query += ` AND date >= $${paramIndex}`;
      queryParams.push(params.startDate);
      paramIndex++;
    }

    if (params?.endDate) {
      query += ` AND date <= $${paramIndex}`;
      queryParams.push(params.endDate);
      paramIndex++;
    }

    if (params?.type) {
      query += ` AND type = $${paramIndex}`;
      queryParams.push(params.type);
      paramIndex++;
    }

    query += ` ORDER BY date DESC, created_at DESC`;

    const result = await db.query(query, queryParams);
    return result.rows;
  }

  async createRecord(userId: number, data: RecordRequest): Promise<RecordItem> {
    const result = await db.query(
      `INSERT INTO records (type, category, category_icon, amount, remark, date, account, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id::text, type, category, category_icon as "categoryIcon", 
                 amount, remark, date::text, account`,
      [data.type, data.category, data.categoryIcon, data.amount, data.remark, data.date, data.account, userId]
    );
    return result.rows[0];
  }

  async updateRecord(userId: number, id: string, data: Partial<RecordRequest>): Promise<RecordItem | null> {
    const result = await db.query(
      `UPDATE records 
       SET type = COALESCE($1, type), 
           category = COALESCE($2, category), 
           category_icon = COALESCE($3, category_icon), 
           amount = COALESCE($4, amount), 
           remark = COALESCE($5, remark), 
           date = COALESCE($6, date), 
           account = COALESCE($7, account),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 AND user_id = $9
       RETURNING id::text, type, category, category_icon as "categoryIcon", 
                 amount, remark, date::text, account`,
      [data.type, data.category, data.categoryIcon, data.amount, data.remark, data.date, data.account, id, userId]
    );
    return result.rows[0] || null;
  }

  async deleteRecord(userId: number, id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM records WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getRecordById(userId: number, id: string): Promise<RecordItem | null> {
    const result = await db.query(
      `SELECT 
        id::text, type, category, category_icon as "categoryIcon", 
        amount, remark, date::text, account
       FROM records 
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return result.rows[0] || null;
  }
}

export const recordService = new RecordService();
