import type { Context } from 'hono';
import { categoryService } from '../services/category.service';
import { logger } from '../utils/logger';
import type { CategoryRequest } from '../types/category';

export class CategoryController {
  async getExpenseCategories(c: Context) {
    const user = c.get('user');

    try {
      logger.info(`获取支出分类`, { userId: user.userId });
      const categories = await categoryService.getExpenseCategories(user.userId);
      return c.json(categories);
    } catch (error) {
      logger.error(`获取支出分类失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取分类失败' }, 500);
    }
  }

  async getIncomeCategories(c: Context) {
    const user = c.get('user');

    try {
      logger.info(`获取收入分类`, { userId: user.userId });
      const categories = await categoryService.getIncomeCategories(user.userId);
      return c.json(categories);
    } catch (error) {
      logger.error(`获取收入分类失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取分类失败' }, 500);
    }
  }

  async getAllCategories(c: Context) {
    const user = c.get('user');

    try {
      logger.info(`获取所有分类`, { userId: user.userId });
      const categories = await categoryService.getAllCategories(user.userId);
      return c.json(categories);
    } catch (error) {
      logger.error(`获取所有分类失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取分类失败' }, 500);
    }
  }

  async createCategory(c: Context) {
    const user = c.get('user');

    try {
      const body = await c.req.json<CategoryRequest>();

      if (!body.name || !body.icon || !body.type) {
        logger.warn(`创建分类参数错误`, { userId: user.userId, body });
        return c.json({ error: '名称、图标和类型不能为空' }, 400);
      }

      logger.info(`创建分类`, { userId: user.userId, body });
      const category = await categoryService.createCategory(user.userId, body);
      logger.info(`创建分类成功`, { userId: user.userId, categoryId: category.id });
      return c.json(category, 201);
    } catch (error) {
      logger.error(`创建分类失败`, error as Error, { userId: user.userId });
      return c.json({ error: '创建分类失败' }, 500);
    }
  }

  async updateCategory(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');

    if (!id) {
      return c.json({ error: 'ID参数缺失' }, 400);
    }

    try {
      const body = await c.req.json<Partial<CategoryRequest>>();

      logger.info(`更新分类`, { userId: user.userId, categoryId: id, body });
      const category = await categoryService.updateCategory(user.userId, id, body);

      if (!category) {
        logger.warn(`更新分类不存在`, { userId: user.userId, categoryId: id });
        return c.json({ error: '分类不存在' }, 404);
      }

      logger.info(`更新分类成功`, { userId: user.userId, categoryId: id });
      return c.json(category);
    } catch (error) {
      logger.error(`更新分类失败`, error as Error, { userId: user.userId, categoryId: id });
      return c.json({ error: '更新分类失败' }, 500);
    }
  }

  async deleteCategory(c: Context) {
    const user = c.get('user');
    const id = c.req.param('id');

    if (!id) {
      return c.json({ error: 'ID参数缺失' }, 400);
    }

    try {
      logger.info(`删除分类`, { userId: user.userId, categoryId: id });
      const success = await categoryService.deleteCategory(user.userId, id);

      if (!success) {
        logger.warn(`删除分类不存在`, { userId: user.userId, categoryId: id });
        return c.json({ error: '分类不存在' }, 404);
      }

      logger.info(`删除分类成功`, { userId: user.userId, categoryId: id });
      return c.json({ message: '删除成功' });
    } catch (error) {
      logger.error(`删除分类失败`, error as Error, { userId: user.userId, categoryId: id });
      return c.json({ error: '删除分类失败' }, 500);
    }
  }
}

export const categoryController = new CategoryController();
