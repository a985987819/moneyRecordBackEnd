import { db } from '../config/database';
import { BaseService } from '../utils/base.service';
import type { CategoryRequest, CategoryResponse, CategoryType } from '../types/category';

/**
 * 分类服务
 * 处理用户收支分类的CRUD操作
 */
export class CategoryService extends BaseService {
  /**
   * 获取支出分类列表
   * @param userId 用户ID
   * @returns 支出分类数组
   */
  async getExpenseCategories(userId: number): Promise<CategoryResponse[]> {
    const result = await db.query(
      `SELECT id::text, name, icon, type, color,
              TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
              TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at
       FROM categories 
       WHERE type = 'expense' AND (user_id = $1 OR user_id IS NULL)`,
      [userId]
    );
    return result.rows.map(row => this.mapToResponse(row));
  }

  /**
   * 获取收入分类列表
   * @param userId 用户ID
   * @returns 收入分类数组
   */
  async getIncomeCategories(userId: number): Promise<CategoryResponse[]> {
    const result = await db.query(
      `SELECT id::text, name, icon, type, color,
              TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
              TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at
       FROM categories 
       WHERE type = 'income' AND (user_id = $1 OR user_id IS NULL)`,
      [userId]
    );
    return result.rows.map(row => this.mapToResponse(row));
  }

  /**
   * 获取所有分类（按类型分组）
   * @param userId 用户ID
   * @returns 支出和收入分类的分组对象
   */
  async getAllCategories(userId: number): Promise<{ expense: CategoryResponse[]; income: CategoryResponse[] }> {
    const [expenseResult, incomeResult] = await Promise.all([
      db.query(
        `SELECT id::text, name, icon, type, color,
                TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at
         FROM categories 
         WHERE type = 'expense' AND (user_id = $1 OR user_id IS NULL)`,
        [userId]
      ),
      db.query(
        `SELECT id::text, name, icon, type, color,
                TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at
         FROM categories 
         WHERE type = 'income' AND (user_id = $1 OR user_id IS NULL)`,
        [userId]
      ),
    ]);

    return {
      expense: expenseResult.rows.map(row => this.mapToResponse(row)),
      income: incomeResult.rows.map(row => this.mapToResponse(row)),
    };
  }

  /**
   * 创建分类
   * @param userId 用户ID
   * @param data 分类数据
   * @returns 创建的分类
   */
  async createCategory(userId: number, data: CategoryRequest): Promise<CategoryResponse> {
    const result = await db.query(
      `INSERT INTO categories (name, icon, type, color, user_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id::text, name, icon, type, color,
                 TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                 TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
      [data.name, data.icon, data.type, data.color || null, userId]
    );
    const row = result.rows[0];
    if (!row) {
      throw new Error('分类创建失败');
    }
    return this.mapToResponse(row);
  }

  /**
   * 更新分类
   * @param userId 用户ID
   * @param id 分类ID
   * @param data 更新的数据
   * @returns 更新后的分类，不存在返回null
   */
  async updateCategory(userId: number, id: string, data: Partial<CategoryRequest>): Promise<CategoryResponse | null> {
    const result = await db.query(
      `UPDATE categories 
       SET name = COALESCE($1, name), 
           icon = COALESCE($2, icon), 
           type = COALESCE($3, type), 
           color = COALESCE($4, color),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND user_id = $6
       RETURNING id::text, name, icon, type, color,
                 TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at,
                 TO_CHAR(updated_at, 'YYYY-MM-DD HH24:MI:SS') as updated_at`,
      [data.name, data.icon, data.type, data.color, id, userId]
    );
    const row = result.rows[0];
    return row ? this.mapToResponse(row) : null;
  }

  /**
   * 删除分类
   * @param userId 用户ID
   * @param id 分类ID
   * @returns 是否删除成功
   */
  async deleteCategory(userId: number, id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * 初始化默认分类
   * @param userId 用户ID
   */
  async initDefaultCategories(userId: number): Promise<void> {
    const defaultCategories = [
      { name: '餐饮', icon: '🍔', type: 'expense' as CategoryType, color: '#FF6B6B' },
      { name: '交通', icon: '🚗', type: 'expense' as CategoryType, color: '#4ECDC4' },
      { name: '购物', icon: '🛍️', type: 'expense' as CategoryType, color: '#45B7D1' },
      { name: '娱乐', icon: '🎮', type: 'expense' as CategoryType, color: '#96CEB4' },
      { name: '居住', icon: '🏠', type: 'expense' as CategoryType, color: '#FFEAA7' },
      { name: '医疗', icon: '🏥', type: 'expense' as CategoryType, color: '#DFE6E9' },
      { name: '教育', icon: '📚', type: 'expense' as CategoryType, color: '#A29BFE' },
      { name: '其他支出', icon: '📦', type: 'expense' as CategoryType, color: '#B2BEC3' },
      { name: '工资', icon: '💰', type: 'income' as CategoryType, color: '#00B894' },
      { name: '奖金', icon: '🎁', type: 'income' as CategoryType, color: '#FDCB6E' },
      { name: '投资', icon: '📈', type: 'income' as CategoryType, color: '#E17055' },
      { name: '兼职', icon: '💼', type: 'income' as CategoryType, color: '#74B9FF' },
      { name: '其他收入', icon: '💵', type: 'income' as CategoryType, color: '#55A3FF' },
    ];

    for (const cat of defaultCategories) {
      await db.query(
        `INSERT INTO categories (name, icon, type, color, user_id) 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [cat.name, cat.icon, cat.type, cat.color, userId]
      );
    }
  }

  /**
   * 将数据库行映射为响应对象
   * @param row 数据库行
   * @returns 分类响应对象
   */
  private mapToResponse(row: Record<string, unknown>): CategoryResponse {
    return {
      id: String(row.id),
      name: String(row.name),
      icon: String(row.icon),
      type: row.type as CategoryType,
      color: row.color ? String(row.color) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const categoryService = new CategoryService();
