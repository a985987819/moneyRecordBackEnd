import { templateService } from '../services/template.service';
import { logger } from '../utils/logger';
import type { AuthContext } from '../middleware/auth.middleware';
import type { TemplateRequest, UseTemplateRequest } from '../types/template';

export class TemplateController {
  // 获取所有模板
  async getAllTemplates(c: AuthContext) {
    const user = c.get('user');

    try {
      logger.info(`获取模板列表`, { userId: user.userId });
      const templates = await templateService.getAllTemplates(user.userId);
      return c.json({ templates });
    } catch (error) {
      logger.error(`获取模板列表失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取模板列表失败' }, 500);
    }
  }

  // 创建模板
  async createTemplate(c: AuthContext) {
    const user = c.get('user');

    try {
      const body = await c.req.json<TemplateRequest>();

      if (!body.name || !body.type || !body.category || !body.account) {
        logger.warn(`创建模板参数错误`, { userId: user.userId, body });
        return c.json({ error: '模板名称、类型、分类和账户不能为空' }, 400);
      }

      logger.info(`创建模板`, { userId: user.userId, body });
      const template = await templateService.createTemplate(user.userId, body);

      logger.info(`创建模板成功`, { userId: user.userId, templateId: template.id });
      return c.json({ template, message: '模板创建成功' }, 201);
    } catch (error) {
      logger.error(`创建模板失败`, error as Error, { userId: user.userId });
      return c.json({ error: '创建模板失败' }, 500);
    }
  }

  // 更新模板
  async updateTemplate(c: AuthContext) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      const body = await c.req.json<Partial<TemplateRequest>>();

      logger.info(`更新模板`, { userId: user.userId, id, body });
      const template = await templateService.updateTemplate(user.userId, id, body);

      if (!template) {
        logger.warn(`模板不存在`, { userId: user.userId, id });
        return c.json({ error: '模板不存在' }, 404);
      }

      logger.info(`更新模板成功`, { userId: user.userId, id });
      return c.json({ template, message: '模板更新成功' });
    } catch (error) {
      logger.error(`更新模板失败`, error as Error, { userId: user.userId, id });
      return c.json({ error: '更新模板失败' }, 500);
    }
  }

  // 删除模板
  async deleteTemplate(c: AuthContext) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      logger.info(`删除模板`, { userId: user.userId, id });
      const deleted = await templateService.deleteTemplate(user.userId, id);

      if (!deleted) {
        logger.warn(`模板不存在`, { userId: user.userId, id });
        return c.json({ error: '模板不存在' }, 404);
      }

      logger.info(`删除模板成功`, { userId: user.userId, id });
      return c.json({ message: '模板删除成功' });
    } catch (error) {
      logger.error(`删除模板失败`, error as Error, { userId: user.userId, id });
      return c.json({ error: '删除模板失败' }, 500);
    }
  }

  // 使用模板创建记录
  async useTemplate(c: AuthContext) {
    const user = c.get('user');
    const id = c.req.param('id');

    try {
      const body = await c.req.json<UseTemplateRequest>();

      logger.info(`使用模板创建记录`, { userId: user.userId, templateId: id, body });
      const record = await templateService.useTemplate(user.userId, id, body);

      if (!record) {
        logger.warn(`模板不存在`, { userId: user.userId, templateId: id });
        return c.json({ error: '模板不存在' }, 404);
      }

      logger.info(`使用模板创建记录成功`, { userId: user.userId, recordId: record.id });
      return c.json({ record, message: '记录创建成功' }, 201);
    } catch (error) {
      logger.error(`使用模板创建记录失败`, error as Error, { userId: user.userId, templateId: id });
      return c.json({ error: '创建记录失败' }, 500);
    }
  }
}

export const templateController = new TemplateController();
