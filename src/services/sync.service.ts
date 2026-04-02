import { db } from '../config/database';
import type { SyncData, SyncVersion, SyncUploadResponse, SyncDownloadResponse } from '../types/sync';

export class SyncService {
  // 上传数据
  async uploadData(userId: number, data: SyncData): Promise<SyncUploadResponse> {
    const client = await db.getClient();

    try {
      await client.query('BEGIN');

      // 获取当前最大版本号
      const versionResult = await client.query(
        `SELECT COALESCE(MAX(version), 0) + 1 as next_version
         FROM sync_versions WHERE user_id = $1`,
        [userId]
      );
      const version = parseInt(versionResult.rows[0].next_version);

      // 计算数据大小
      const dataSize = Buffer.byteLength(JSON.stringify(data), 'utf8');
      const recordCount =
        data.records?.length || 0 +
        data.categories?.length || 0 +
        data.accounts?.length || 0 +
        data.savingsGoals?.length || 0 +
        data.debts?.length || 0;

      // 保存同步版本
      await client.query(
        `INSERT INTO sync_versions (version, data, record_count, size, user_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [version, JSON.stringify(data), recordCount, dataSize, userId]
      );

      // 更新用户最后同步时间
      await client.query(
        `UPDATE users SET last_sync_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [userId]
      );

      await client.query('COMMIT');

      return {
        version,
        message: '数据上传成功',
        recordCount,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // 下载数据
  async downloadData(userId: number, version?: number): Promise<SyncDownloadResponse> {
    let query: string;
    let params: any[];

    if (version) {
      // 下载指定版本
      query = `SELECT version, data, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
               FROM sync_versions WHERE user_id = $1 AND version = $2
               ORDER BY created_at DESC LIMIT 1`;
      params = [userId, version];
    } else {
      // 下载最新版本
      query = `SELECT version, data, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
               FROM sync_versions WHERE user_id = $1
               ORDER BY created_at DESC LIMIT 1`;
      params = [userId];
    }

    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      // 没有同步历史，从各表获取当前数据
      const data = await this.getCurrentData(userId);
      return {
        data,
        version: 0,
        syncedAt: new Date().toISOString(),
      };
    }

    const row = result.rows[0];
    return {
      data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
      version: parseInt(row.version),
      syncedAt: row.created_at,
    };
  }

  // 获取历史版本列表
  async getVersions(userId: number): Promise<SyncVersion[]> {
    const result = await db.query(
      `SELECT id::text, version, record_count, size,
              TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
       FROM sync_versions
       WHERE user_id = $1
       ORDER BY version DESC
       LIMIT 10`,
      [userId]
    );

    return result.rows.map((row) => ({
      id: row.id,
      version: parseInt(row.version),
      recordCount: parseInt(row.record_count),
      size: parseInt(row.size),
      createdAt: row.created_at,
    }));
  }

  // 恢复到指定版本
  async restoreVersion(userId: number, versionId: string): Promise<SyncDownloadResponse> {
    const result = await db.query(
      `SELECT version, data, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
       FROM sync_versions
       WHERE id = $1 AND user_id = $2`,
      [versionId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('版本不存在');
    }

    const row = result.rows[0];
    return {
      data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
      version: parseInt(row.version),
      syncedAt: row.created_at,
    };
  }

  // 获取当前数据（从各表）
  private async getCurrentData(userId: number): Promise<SyncData> {
    const records = await db.query(
      `SELECT id::text, type, category, sub_category, category_icon, amount, remark,
              TO_CHAR(date, 'YYYY-MM-DD HH24:MI:SS') as date, account, is_import
       FROM records WHERE user_id = $1`,
      [userId]
    );

    const categories = await db.query(
      `SELECT id::text, name, icon, type, color FROM categories WHERE user_id = $1`,
      [userId]
    );

    const accounts = await db.query(
      `SELECT id::text, name, type, icon, balance, initial_balance, is_default, color
       FROM accounts WHERE user_id = $1`,
      [userId]
    );

    const savingsGoals = await db.query(
      `SELECT id::text, name, target_amount, current_amount, deadline, icon, color, status
       FROM savings_goals WHERE user_id = $1`,
      [userId]
    );

    const debts = await db.query(
      `SELECT id::text, type, person_name, amount, repaid_amount, remaining_amount,
              date, expected_repay_date, remark, status
       FROM debts WHERE user_id = $1`,
      [userId]
    );

    const budgets = await db.query(
      `SELECT id::text, year, month, amount, spent FROM budgets WHERE user_id = $1`,
      [userId]
    );

    const templates = await db.query(
      `SELECT id::text, name, type, category, sub_category, category_icon, amount, remark, account
       FROM record_templates WHERE user_id = $1`,
      [userId]
    );

    const recurringRecords = await db.query(
      `SELECT id::text, type, category, sub_category, category_icon, amount, remark,
              frequency, start_date, end_date, next_execute_date, account, is_active
       FROM recurring_records WHERE user_id = $1`,
      [userId]
    );

    return {
      records: records.rows,
      categories: categories.rows,
      accounts: accounts.rows,
      savingsGoals: savingsGoals.rows,
      debts: debts.rows,
      budgets: budgets.rows,
      templates: templates.rows,
      recurringRecords: recurringRecords.rows,
    };
  }
}

export const syncService = new SyncService();
