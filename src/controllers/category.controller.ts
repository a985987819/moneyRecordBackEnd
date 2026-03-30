import type { Context } from 'hono';
import { categoryService } from '../services/category.service';
import type { CategoryRequest } from '../types/category';

export class CategoryController {
  async getExpenseCategories(c: Context) {
    try {
      const user = c.get('user');
      const categories = await categoryService.getExpenseCategories(user.userId);
      return c.json(categories);
    } catch (error) {
      return c.json({ error: '获取支出分类失败' }, 500);
    }
  }

  async getIncomeCategories(c: Context) {
    try {
      const user = c.get('user');
      const categories = await categoryService.getIncomeCategories(user.userId);
      return c.json(categories);
    } catch (error) {
      return c.json({ error: '获取收入分类失败' }, 500);
    }
  }

  async getAllCategories(c: Context) {
    try {
      const user = c.get('user');
      const categories = await categoryService.getAllCategories(user.userId);
      return c.json(categories);
    } catch (error) {
      return c.json({ error: '获取分类列表失败' }, 500);
    }
  }

  async createCategory(c: Context) {
    try {
      const user = c.get('user');
      const body = await c.req.json<CategoryRequest>();

      if (!body.name || !body.icon || !body.type) {
        return c.json({ error: '名称、图标和类型不能为空' }, 400);
      }

      const category = await categoryService.createCategory(user.userId, body);
      return c.json(category, 201);
    } catch (error) {
      return c.json({ error: '创建分类失败' }, 500);
    }
  }

  async updateCategory(c: Context) {
    try {
      const user = c.get('user');
      const id = c.req.param('id');
      const body = await c.req.json<Partial<CategoryRequest>>();

      const category = await categoryService.updateCategory(user.userId, id, body);
      if (!category) {
        return c.json({ error: '分类不存在' }, 404);
      }
      return c.json(category);
    } catch (error) {
      return c.json({ error: '更新分类失败' }, 500);
    }
  }

  async deleteCategory(c: Context) {
    try {
      const user = c.get('user');
      const id = c.req.param('id');

      const success = await categoryService.deleteCategory(user.userId, id);
      if (!success) {
        return c.json({ error: '分类不存在' }, 404);
      }
      return c.json({ message: '删除成功' });
    } catch (error) {
      return c.json({ error: '删除分类失败' }, 500);
    }
  }
}

export const categoryController = new CategoryController();
