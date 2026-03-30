import { db } from '../config/database';
import type { Category, CategoryRequest, CategoryType } from '../types/category';

export class CategoryService {
  async getExpenseCategories(userId: number): Promise<Category[]> {
    const result = await db.query(
      `SELECT id::text, name, icon, type, color 
       FROM categories 
       WHERE type = 'expense' AND (user_id = $1 OR user_id IS NULL)`,
      [userId]
    );
    return result.rows;
  }

  async getIncomeCategories(userId: number): Promise<Category[]> {
    const result = await db.query(
      `SELECT id::text, name, icon, type, color 
       FROM categories 
       WHERE type = 'income' AND (user_id = $1 OR user_id IS NULL)`,
      [userId]
    );
    return result.rows;
  }

  async getAllCategories(userId: number): Promise<{ expense: Category[]; income: Category[] }> {
    const [expenseResult, incomeResult] = await Promise.all([
      db.query(
        `SELECT id::text, name, icon, type, color 
         FROM categories 
         WHERE type = 'expense' AND (user_id = $1 OR user_id IS NULL)`,
        [userId]
      ),
      db.query(
        `SELECT id::text, name, icon, type, color 
         FROM categories 
         WHERE type = 'income' AND (user_id = $1 OR user_id IS NULL)`,
        [userId]
      ),
    ]);

    return {
      expense: expenseResult.rows,
      income: incomeResult.rows,
    };
  }

  async createCategory(userId: number, data: CategoryRequest): Promise<Category> {
    const result = await db.query(
      `INSERT INTO categories (name, icon, type, color, user_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id::text, name, icon, type, color`,
      [data.name, data.icon, data.type, data.color || null, userId]
    );
    return result.rows[0];
  }

  async updateCategory(userId: number, id: string, data: Partial<CategoryRequest>): Promise<Category | null> {
    const result = await db.query(
      `UPDATE categories 
       SET name = COALESCE($1, name), 
           icon = COALESCE($2, icon), 
           type = COALESCE($3, type), 
           color = COALESCE($4, color)
       WHERE id = $5 AND user_id = $6
       RETURNING id::text, name, icon, type, color`,
      [data.name, data.icon, data.type, data.color, id, userId]
    );
    return result.rows[0] || null;
  }

  async deleteCategory(userId: number, id: string): Promise<boolean> {
    const result = await db.query(
      `DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  }

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
}

export const categoryService = new CategoryService();
