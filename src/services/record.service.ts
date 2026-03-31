import { db } from '../config/database';
import type { RecordItem, RecordRequest, MonthlyStats, RecordQueryParams, PaginatedRecordsResponse, RecordsByDate, ImportRecordRequest, BatchImportResult } from '../types/record';

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const result = await db.query(
      `SELECT 
        id::text, type, category, sub_category as "subCategory", category_icon as "categoryIcon", 
        amount, remark, date::text, account, is_import as "isImport"
       FROM records 
       WHERE user_id = $1 
         AND date >= $2 
         AND date < $3
       ORDER BY date DESC, created_at DESC
       LIMIT 50`,
      [userId, threeDaysAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]]
    );

    return result.rows;
  }

  async getRecords(userId: number, params?: RecordQueryParams): Promise<RecordItem[]> {
    let query = `
      SELECT 
        id::text, type, category, sub_category as "subCategory", category_icon as "categoryIcon", 
        amount, remark, date::text, account, is_import as "isImport"
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

  async getRecordsByDatePaginated(
    userId: number,
    cursor?: string,
    limit: number = 10
  ): Promise<PaginatedRecordsResponse> {
    const cursorDate = cursor || new Date().toISOString().split('T')[0];

    const distinctDatesResult = await db.query(
      `SELECT DISTINCT date::text as date
       FROM records 
       WHERE user_id = $1 AND date < $2
       ORDER BY date DESC
       LIMIT $3`,
      [userId, cursorDate, limit + 1]
    );

    const dates = distinctDatesResult.rows.map(row => row.date);
    const hasMore = dates.length > limit;
    const targetDates = hasMore ? dates.slice(0, limit) : dates;

    if (targetDates.length === 0) {
      return {
        data: [],
        hasMore: false,
      };
    }

    const recordsResult = await db.query(
      `SELECT 
        id::text, type, category, sub_category as "subCategory", category_icon as "categoryIcon", 
        amount, remark, date::text, account, is_import as "isImport"
       FROM records 
       WHERE user_id = $1 AND date = ANY($2)
       ORDER BY date DESC, created_at DESC`,
      [userId, targetDates]
    );

    const recordsByDate: Map<string, RecordItem[]> = new Map();
    for (const record of recordsResult.rows) {
      if (!recordsByDate.has(record.date)) {
        recordsByDate.set(record.date, []);
      }
      recordsByDate.get(record.date)!.push(record);
    }

    const data: RecordsByDate[] = targetDates.map(date => ({
      date,
      records: recordsByDate.get(date) || [],
    }));

    return {
      data,
      hasMore,
      nextCursor: hasMore ? targetDates[targetDates.length - 1] : undefined,
    };
  }

  async createRecord(userId: number, data: RecordRequest): Promise<RecordItem> {
    const result = await db.query(
      `INSERT INTO records (type, category, sub_category, category_icon, amount, remark, date, account, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING id::text, type, category, sub_category as "subCategory", category_icon as "categoryIcon", 
                 amount, remark, date::text, account, is_import as "isImport"`,
      [data.type, data.category, data.subCategory || null, data.categoryIcon, data.amount, data.remark, data.date, data.account, userId]
    );
    return result.rows[0];
  }

  async batchImportRecords(userId: number, records: ImportRecordRequest[]): Promise<BatchImportResult> {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      let success = 0;
      const errors: string[] = [];

      for (let i = 0; i < records.length; i++) {
        const record = records[i];

        if (!record.type || !record.category || !record.amount || !record.date) {
          errors.push(`第 ${i + 1} 条记录: 类型、分类、金额和日期不能为空`);
          continue;
        }

        try {
          await client.query(
            `INSERT INTO records (type, category, sub_category, category_icon, amount, remark, date, account, is_import, user_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, $9)`,
            [
              record.type,
              record.category,
              record.subCategory || null,
              record.categoryIcon || '📦',
              record.amount,
              record.remark || '',
              record.date,
              record.account || '现金',
              userId
            ]
          );
          success++;
        } catch (error) {
          errors.push(`第 ${i + 1} 条记录导入失败: ${error}`);
        }
      }

      await client.query('COMMIT');

      return {
        success,
        failed: records.length - success,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteImportRecords(userId: number): Promise<{ deletedCount: number }> {
    const result = await db.query(
      `DELETE FROM records WHERE user_id = $1 AND is_import = TRUE RETURNING id`,
      [userId]
    );
    return { deletedCount: result.rowCount || 0 };
  }

  async updateRecord(userId: number, id: string, data: Partial<RecordRequest>): Promise<RecordItem | null> {
    const result = await db.query(
      `UPDATE records 
       SET type = COALESCE($1, type), 
           category = COALESCE($2, category), 
           sub_category = COALESCE($3, sub_category), 
           category_icon = COALESCE($4, category_icon), 
           amount = COALESCE($5, amount), 
           remark = COALESCE($6, remark), 
           date = COALESCE($7, date), 
           account = COALESCE($8, account),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND user_id = $10
       RETURNING id::text, type, category, sub_category as "subCategory", category_icon as "categoryIcon", 
                 amount, remark, date::text, account, is_import as "isImport"`,
      [data.type, data.category, data.subCategory, data.categoryIcon, data.amount, data.remark, data.date, data.account, id, userId]
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
        id::text, type, category, sub_category as "subCategory", category_icon as "categoryIcon", 
        amount, remark, date::text, account, is_import as "isImport"
       FROM records 
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return result.rows[0] || null;
  }
}

export const recordService = new RecordService();
