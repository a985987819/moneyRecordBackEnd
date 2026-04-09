import { db } from '../config/database';
import type {
  BatchImportResult,
  BillFilterParams,
  BillListResponse,
  CategoryStats,
  DeduplicatePreviewResult,
  DeduplicateResult,
  DuplicateGroup,
  DuplicateRecord,
  ImportRecordRequest,
  MonthlyStats,
  PaginatedRecordsResponse,
  RecordItem,
  RecordQueryParams,
  RecordRequest,
  RecordsByDate,
  RecurrenceFrequency,
  RecurringRecordRequest,
  RecurringRecordResult,
  ReportData,
} from '../types/record';
import { BaseService } from '../utils/base.service';
import { extractDate, formatDateTime } from '../utils/date';
import { budgetService } from './budget.service';

export class RecordService extends BaseService {
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
      totalExpense: this.getFloat(result.rows[0], 'total_expense'),
      totalIncome: this.getFloat(result.rows[0], 'total_income'),
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
        amount, remark, TO_CHAR(date, 'YYYY-MM-DD HH24:MI:SS') as date, account, is_import as "isImport"
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
        amount, remark, TO_CHAR(date, 'YYYY-MM-DD HH24:MI:SS') as date, account, is_import as "isImport"
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
    // 如果没有 cursor，使用明天作为边界，确保能获取到今天的记录
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const cursorDate = cursor || tomorrow.toISOString().split('T')[0];

    const distinctDatesResult = await db.query(
      `SELECT DISTINCT TO_CHAR(date, 'YYYY-MM-DD') as date
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
        amount, remark, TO_CHAR(date, 'YYYY-MM-DD HH24:MI:SS') as date, account, is_import as "isImport"
       FROM records
       WHERE user_id = $1 AND TO_CHAR(date, 'YYYY-MM-DD') = ANY($2)
       ORDER BY date DESC, created_at DESC`,
      [userId, targetDates]
    );

    const recordsByDate: Map<string, RecordItem[]> = new Map();
    for (const record of recordsResult.rows) {
      const dateKey = extractDate(record.date);
      if (!recordsByDate.has(dateKey)) {
        recordsByDate.set(dateKey, []);
      }
      recordsByDate.get(dateKey)!.push(record);
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

  // 获取报表统计数据
  async getReportData(userId: number, year?: number, month?: number): Promise<ReportData> {
    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month || (now.getMonth() + 1);

    // 构建日期范围
    const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
    const endDate = month
      ? `${targetYear}-${String(targetMonth).padStart(2, '0')}-31`
      : `${targetYear}-12-31`;

    // 获取每日统计
    const dailyResult = await db.query(
      `SELECT 
        date::text as date,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income
       FROM records 
       WHERE user_id = $1 AND date >= $2 AND date <= $3
       GROUP BY date
       ORDER BY date ASC`,
      [userId, startDate, endDate]
    );

    // 获取分类统计 - 支出
    const expenseCategoryResult = await db.query(
      `SELECT 
        category,
        category_icon as "categoryIcon",
        COALESCE(SUM(amount), 0) as amount,
        COUNT(*) as count
       FROM records 
       WHERE user_id = $1 AND date >= $2 AND date <= $3 AND type = 'expense'
       GROUP BY category, category_icon
       ORDER BY amount DESC`,
      [userId, startDate, endDate]
    );

    // 获取分类统计 - 收入
    const incomeCategoryResult = await db.query(
      `SELECT 
        category,
        category_icon as "categoryIcon",
        COALESCE(SUM(amount), 0) as amount,
        COUNT(*) as count
       FROM records 
       WHERE user_id = $1 AND date >= $2 AND date <= $3 AND type = 'income'
       GROUP BY category, category_icon
       ORDER BY amount DESC`,
      [userId, startDate, endDate]
    );

    // 计算总支出和总收入
    const totalExpense = expenseCategoryResult.rows.reduce(
      (sum, row) => sum + this.getFloat(row, 'amount'), 0
    );
    const totalIncome = incomeCategoryResult.rows.reduce(
      (sum, row) => sum + this.getFloat(row, 'amount'), 0
    );

    // 构建分类统计数据（包含百分比）
    const expenseCategoryStats: CategoryStats[] = expenseCategoryResult.rows.map(row => ({
      category: row.category,
      categoryIcon: row.categoryIcon,
      type: 'expense',
      amount: this.getFloat(row, 'amount'),
      percentage: totalExpense > 0 ? parseFloat(((this.getFloat(row, 'amount') / totalExpense) * 100).toFixed(2)) : 0,
      count: this.getInt(row, 'count'),
    }));

    const incomeCategoryStats: CategoryStats[] = incomeCategoryResult.rows.map(row => ({
      category: row.category,
      categoryIcon: row.categoryIcon,
      type: 'income',
      amount: this.getFloat(row, 'amount'),
      percentage: totalIncome > 0 ? parseFloat(((this.getFloat(row, 'amount') / totalIncome) * 100).toFixed(2)) : 0,
      count: this.getInt(row, 'count'),
    }));

    return {
      period: {
        startDate,
        endDate,
      },
      summary: {
        totalExpense,
        totalIncome,
        balance: totalIncome - totalExpense,
      },
      dailyStats: dailyResult.rows.map(row => ({
        date: row.date,
        expense: parseFloat(row.expense),
        income: parseFloat(row.income),
      })),
      categoryStats: {
        expense: expenseCategoryStats,
        income: incomeCategoryStats,
      },
    };
  }

  // 账单筛选查询
  async getBillsWithFilter(userId: number, params: BillFilterParams): Promise<BillListResponse> {
    let query = `
      SELECT
        id::text, type, category, sub_category as "subCategory", category_icon as "categoryIcon",
        amount, remark, TO_CHAR(date, 'YYYY-MM-DD HH24:MI:SS') as date, account, is_import as "isImport"
      FROM records
      WHERE user_id = $1
    `;
    const queryParams: any[] = [userId];
    let paramIndex = 2;

    // 按年月查询
    if (params.year && params.month) {
      query += ` AND TO_CHAR(date, 'YYYY-MM') = $${paramIndex}`;
      queryParams.push(`${params.year}-${String(params.month).padStart(2, '0')}`);
      paramIndex++;
    } else if (params.year) {
      query += ` AND TO_CHAR(date, 'YYYY') = $${paramIndex}`;
      queryParams.push(String(params.year));
      paramIndex++;
    }

    // 按日期范围查询
    if (params.startDate) {
      query += ` AND date >= $${paramIndex}`;
      queryParams.push(params.startDate);
      paramIndex++;
    }

    if (params.endDate) {
      query += ` AND date <= $${paramIndex}`;
      queryParams.push(params.endDate);
      paramIndex++;
    }

    // 按类型查询
    if (params.type) {
      query += ` AND type = $${paramIndex}`;
      queryParams.push(params.type);
      paramIndex++;
    }

    // 按分类查询
    if (params.categories && params.categories.length > 0) {
      query += ` AND category = ANY($${paramIndex})`;
      queryParams.push(params.categories);
      paramIndex++;
    }

    // 按金额范围查询
    if (params.minAmount !== undefined) {
      query += ` AND amount >= $${paramIndex}`;
      queryParams.push(params.minAmount);
      paramIndex++;
    }

    if (params.maxAmount !== undefined) {
      query += ` AND amount <= $${paramIndex}`;
      queryParams.push(params.maxAmount);
      paramIndex++;
    }

    query += ` ORDER BY date DESC, created_at DESC`;

    const result = await db.query(query, queryParams);
    const records = result.rows;

    // 计算汇总数据
    const totalExpense = records
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + this.getFloat(r, 'amount'), 0);
    const totalIncome = records
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + this.getFloat(r, 'amount'), 0);

    return {
      summary: {
        totalExpense,
        totalIncome,
        count: records.length,
      },
      records,
    };
  }

  // 生成定时记账记录
  private generateRecurringDates(
    frequency: RecurringFrequency,
    startDate: string,
    endDate: Date
  ): string[] {
    const dates: string[] = [];
    const start = new Date(startDate);
    const current = new Date(start);

    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      const dateStr = current.toISOString().split('T')[0];

      switch (frequency) {
        case 'daily':
          dates.push(dateStr);
          break;
        case 'workday':
          // 周一到周五 (1-5)
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            dates.push(dateStr);
          }
          break;
        case 'weekly':
          // 每周同一天（与开始日期相同的星期几）
          if (dayOfWeek === start.getDay()) {
            dates.push(dateStr);
          }
          break;
        case 'monthly':
          // 每月同一天
          if (current.getDate() === start.getDate()) {
            dates.push(dateStr);
          }
          break;
      }

      // 增加一天
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  // 创建定时记账记录
  async createRecurringRecords(
    userId: number,
    data: RecurringRecordRequest
  ): Promise<RecurringRecordResult> {
    // 计算结束日期
    const durationValue = data.durationValue || 1;
    const durationUnit = data.durationUnit || 'year';

    const endDate = new Date(data.startDate);
    if (durationUnit === 'year') {
      endDate.setFullYear(endDate.getFullYear() + durationValue);
    } else {
      endDate.setMonth(endDate.getMonth() + durationValue);
    }

    // 生成日期列表
    const dates = this.generateRecurringDates(data.frequency, data.startDate, endDate);

    if (dates.length === 0) {
      return {
        success: 0,
        failed: 0,
        generatedDates: [],
        errors: ['没有生成任何记录，请检查日期范围'],
      };
    }

    const client = await db.getClient();
    let success = 0;
    const errors: string[] = [];

    try {
      await client.query('BEGIN');

      for (const date of dates) {
        try {
          await client.query(
            `INSERT INTO records (type, category, sub_category, category_icon, amount, remark, date, account, user_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              data.type,
              data.category,
              data.subCategory || null,
              data.categoryIcon,
              data.amount,
              data.remark,
              date,
              data.account,
              userId
            ]
          );
          success++;
        } catch (error) {
          errors.push(`日期 ${date} 创建失败: ${error}`);
        }
      }

      await client.query('COMMIT');

      return {
        success,
        failed: dates.length - success,
        generatedDates: dates,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async createRecord(userId: number, data: RecordRequest): Promise<RecordItem> {
    // 转换日期格式
    const formattedDate = formatDateTime(data.date);

    const result = await db.query(
      `INSERT INTO records (type, category, sub_category, category_icon, amount, remark, date, account, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id::text, type, category, sub_category as "subCategory", category_icon as "categoryIcon",
                 amount, remark, TO_CHAR(date, 'YYYY-MM-DD HH24:MI:SS') as date, account, is_import as "isImport"`,
      [data.type, data.category, data.subCategory || null, data.categoryIcon, data.amount, data.remark, formattedDate, data.account, userId]
    );

    const record = result.rows[0];

    // 更新预算支出（如果是支出类型）
    const date = new Date(formattedDate);
    await budgetService.updateSpent(userId, date.getFullYear(), date.getMonth() + 1, data.amount, data.type === 'expense');

    return record;
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
          // 转换日期格式
          const formattedDate = formatDateTime(record.date);

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
              formattedDate,
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
    // 获取旧记录信息（用于预算调整）
    const oldRecord = await this.getRecordById(userId, id);
    if (!oldRecord) {
      return null;
    }

    // 如果传了日期，转换格式
    const formattedDate = data.date ? formatDateTime(data.date) : undefined;

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
                 amount, remark, TO_CHAR(date, 'YYYY-MM-DD HH24:MI:SS') as date, account, is_import as "isImport"`,
      [data.type, data.category, data.subCategory, data.categoryIcon, data.amount, data.remark, formattedDate, data.account, id, userId]
    );

    const newRecord = result.rows[0];

    // 调整预算
    if (newRecord) {
      const oldDate = new Date(oldRecord.date);
      const newDate = formattedDate ? new Date(formattedDate) : oldDate;
      const oldYear = oldDate.getFullYear();
      const oldMonth = oldDate.getMonth() + 1;
      const newYear = newDate.getFullYear();
      const newMonth = newDate.getMonth() + 1;

      const oldType = oldRecord.type;
      const newType = data.type || oldType;
      const oldAmount = oldRecord.amount;
      const newAmount = data.amount !== undefined ? data.amount : oldAmount;

      // 如果日期或金额或类型发生变化，需要调整预算
      if (oldYear !== newYear || oldMonth !== newMonth || oldAmount !== newAmount || oldType !== newType) {
        // 先扣除旧记录的支出
        await budgetService.updateSpent(userId, oldYear, oldMonth, oldAmount, oldType === 'expense');
        // 再添加新记录的支出
        await budgetService.updateSpent(userId, newYear, newMonth, newAmount, newType === 'expense');
      }
    }

    return newRecord;
  }

  async deleteRecord(userId: number, id: string): Promise<boolean> {
    // 获取记录信息（用于预算调整）
    const record = await this.getRecordById(userId, id);
    if (!record) {
      return false;
    }

    const result = await db.query(
      `DELETE FROM records WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );

    const deleted = result.rowCount ? result.rowCount > 0 : false;

    // 调整预算（删除记录，扣除支出）
    if (deleted) {
      const date = new Date(record.date);
      await budgetService.updateSpent(userId, date.getFullYear(), date.getMonth() + 1, record.amount, record.type === 'expense');
    }

    return deleted;
  }

  async getRecordById(userId: number, id: string): Promise<RecordItem | null> {
    const result = await db.query(
      `SELECT
        id::text, type, category, sub_category as "subCategory", category_icon as "categoryIcon",
        amount, remark, TO_CHAR(date, 'YYYY-MM-DD HH24:MI:SS') as date, account, is_import as "isImport"
       FROM records
       WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return result.rows[0] || null;
  }

  // 查找重复记录（预览）
  async findDuplicateRecords(userId: number): Promise<DeduplicatePreviewResult> {
    // 查询所有记录，用于检测重复
    const result = await db.query(
      `SELECT
        id::text, type, category, amount, TO_CHAR(date, 'YYYY-MM-DD HH24:MI:SS') as date, remark
       FROM records
       WHERE user_id = $1
       ORDER BY date DESC, created_at DESC`,
      [userId]
    );

    const records = result.rows;
    const duplicateMap = new Map<string, DuplicateRecord[]>();

    // 按完整时间、金额、分类、类型分组
    for (const record of records) {
      // 使用完整时间、金额、分类、类型作为重复检测的key
      const key = `${record.date}_${record.amount}_${record.category}_${record.type}`;

      if (!duplicateMap.has(key)) {
        duplicateMap.set(key, []);
      }
      duplicateMap.get(key)!.push({
        id: record.id,
        type: record.type,
        category: record.category,
        amount: this.getFloat(record, 'amount'),
        date: record.date,
        remark: record.remark,
      });
    }

    // 筛选出有重复的记录组
    const duplicateGroups: DuplicateGroup[] = [];
    let totalDuplicates = 0;

    for (const [key, groupRecords] of duplicateMap.entries()) {
      if (groupRecords.length > 1) {
        // 保留第一条（最新的），其余标记为重复
        duplicateGroups.push({
          key,
          count: groupRecords.length,
          records: groupRecords,
          keepId: groupRecords[0].id, // 保留最新的一条
        });
        totalDuplicates += groupRecords.length - 1;
      }
    }

    // 按重复数量倒序排列
    duplicateGroups.sort((a, b) => b.count - a.count);

    return {
      scannedCount: records.length,
      duplicateGroups,
      totalDuplicates,
    };
  }

  // 删除重复记录
  async deduplicateRecords(userId: number): Promise<DeduplicateResult> {
    const preview = await this.findDuplicateRecords(userId);

    if (preview.duplicateGroups.length === 0) {
      return {
        scannedCount: preview.scannedCount,
        duplicateGroups: preview.duplicateGroups,
        totalDuplicates: 0,
        deletedCount: 0,
      };
    }

    const client = await db.getClient();
    let deletedCount = 0;

    try {
      await client.query('BEGIN');

      for (const group of preview.duplicateGroups) {
        // 保留 keepId，删除其他记录
        const idsToDelete = group.records
          .filter(r => r.id !== group.keepId)
          .map(r => r.id);

        if (idsToDelete.length > 0) {
          const result = await client.query(
            `DELETE FROM records 
             WHERE user_id = $1 AND id = ANY($2)`,
            [userId, idsToDelete]
          );
          deletedCount += result.rowCount || 0;
        }
      }

      await client.query('COMMIT');

      return {
        scannedCount: preview.scannedCount,
        duplicateGroups: preview.duplicateGroups,
        totalDuplicates: preview.totalDuplicates,
        deletedCount,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export const recordService = new RecordService();
