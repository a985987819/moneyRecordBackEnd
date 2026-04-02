import { db } from '../config/database';
import { formatDateTime } from '../utils/date';
import type {
  RecordTemplate,
  TemplateRequest,
  TemplateResponse,
  UseTemplateRequest,
} from '../types/template';
import type { RecordItem } from '../types/record';

export class TemplateService {
  // 获取所有模板
  async getAllTemplates(userId: number): Promise<TemplateResponse[]> {
    const result = await db.query(
      `SELECT id::text, name, type, category, sub_category, category_icon, amount, remark, account,
              TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
              TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at
       FROM record_templates
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      category: row.category,
      subCategory: row.sub_category,
      categoryIcon: row.category_icon,
      amount: row.amount ? parseFloat(row.amount) : undefined,
      remark: row.remark,
      account: row.account,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  // 创建模板
  async createTemplate(userId: number, data: TemplateRequest): Promise<TemplateResponse> {
    const result = await db.query(
      `INSERT INTO record_templates
       (name, type, category, sub_category, category_icon, amount, remark, account, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id::text, name, type, category, sub_category, category_icon, amount, remark, account,
                 TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                 TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
      [
        data.name,
        data.type,
        data.category,
        data.subCategory || null,
        data.categoryIcon || '📦',
        data.amount || null,
        data.remark || null,
        data.account,
        userId,
      ]
    );

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      category: row.category,
      subCategory: row.sub_category,
      categoryIcon: row.category_icon,
      amount: row.amount ? parseFloat(row.amount) : undefined,
      remark: row.remark,
      account: row.account,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // 更新模板
  async updateTemplate(
    userId: number,
    id: string,
    data: Partial<TemplateRequest>
  ): Promise<TemplateResponse | null> {
    const result = await db.query(
      `UPDATE record_templates
       SET name = COALESCE($1, name),
           type = COALESCE($2, type),
           category = COALESCE($3, category),
           sub_category = COALESCE($4, sub_category),
           category_icon = COALESCE($5, category_icon),
           amount = COALESCE($6, amount),
           remark = COALESCE($7, remark),
           account = COALESCE($8, account),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND user_id = $10
       RETURNING id::text, name, type, category, sub_category, category_icon, amount, remark, account,
                 TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                 TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
      [
        data.name,
        data.type,
        data.category,
        data.subCategory,
        data.categoryIcon,
        data.amount,
        data.remark,
        data.account,
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
      name: row.name,
      type: row.type,
      category: row.category,
      subCategory: row.sub_category,
      categoryIcon: row.category_icon,
      amount: row.amount ? parseFloat(row.amount) : undefined,
      remark: row.remark,
      account: row.account,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  // 删除模板
  async deleteTemplate(userId: number, id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM record_templates WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // 使用模板创建记录
  async useTemplate(
    userId: number,
    templateId: string,
    data: UseTemplateRequest
  ): Promise<RecordItem | null> {
    // 获取模板信息
    const templateResult = await db.query(
      `SELECT name, type, category, sub_category, category_icon, amount, remark, account
       FROM record_templates
       WHERE id = $1 AND user_id = $2`,
      [templateId, userId]
    );

    if (templateResult.rows.length === 0) {
      return null;
    }

    const template = templateResult.rows[0];
    const now = new Date();
    const date = data.date || now.toISOString();
    const formattedDate = formatDateTime(date);

    // 使用模板数据或覆盖数据创建记录
    const result = await db.query(
      `INSERT INTO records (type, category, sub_category, category_icon, amount, remark, date, account, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id::text, type, category, sub_category as "subCategory", category_icon as "categoryIcon",
                 amount, remark, TO_CHAR(date, 'YYYY-MM-DD HH24:MI:SS') as date, account, is_import as "isImport"`,
      [
        template.type,
        template.category,
        template.sub_category,
        template.category_icon,
        data.amount || template.amount,
        data.remark || template.remark,
        formattedDate,
        template.account,
        userId,
      ]
    );

    return result.rows[0];
  }
}

export const templateService = new TemplateService();
