import { db } from '../config/database';
import { BaseService } from '../utils/base.service';
export class ReminderService extends BaseService {
    mapToResponse(row) {
        return this.mapRowToResponse(row, {
            id: row.id,
            type: row.type,
            time: row.time,
            message: row.message,
            isEnabled: row.is_enabled,
            daysOfWeek: row.days_of_week,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }
    // 获取所有提醒
    async getAllReminders(userId) {
        const result = await db.query(`SELECT id::text, type, time, message, is_enabled, days_of_week,
              TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
              TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at
       FROM reminders
       WHERE user_id = $1
       ORDER BY created_at DESC`, [userId]);
        return result.rows.map((row) => this.mapToResponse(row));
    }
    // 创建提醒
    async createReminder(userId, data) {
        const result = await db.query(`INSERT INTO reminders
       (type, time, message, is_enabled, days_of_week, user_id)
       VALUES ($1, $2, $3, TRUE, $4, $5)
       RETURNING id::text, type, time, message, is_enabled, days_of_week,
                 TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                 TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`, [data.type, data.time, data.message || null, data.daysOfWeek || null, userId]);
        return this.mapToResponse(result.rows[0]);
    }
    // 更新提醒
    async updateReminder(userId, id, data) {
        const result = await db.query(`UPDATE reminders
       SET type = COALESCE($1, type),
           time = COALESCE($2, time),
           message = COALESCE($3, message),
           days_of_week = COALESCE($4, days_of_week),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND user_id = $6
       RETURNING id::text, type, time, message, is_enabled, days_of_week,
                 TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                 TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`, [data.type, data.time, data.message, data.daysOfWeek, id, userId]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapToResponse(result.rows[0]);
    }
    // 删除提醒
    async deleteReminder(userId, id) {
        const result = await db.query(`DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING id`, [id, userId]);
        return result.rowCount ? result.rowCount > 0 : false;
    }
    // 切换启用/禁用状态
    async toggleReminder(userId, id) {
        const result = await db.query(`UPDATE reminders
       SET is_enabled = NOT is_enabled,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING id::text, type, time, message, is_enabled, days_of_week,
                 TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                 TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`, [id, userId]);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapToResponse(result.rows[0]);
    }
}
export const reminderService = new ReminderService();
//# sourceMappingURL=reminder.service.js.map