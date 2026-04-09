import { Hono } from 'hono';
import { templateController } from '../controllers/template.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import type { AuthContext } from '../middleware/auth.middleware';

const templateRoutes = new Hono();

// 所有模板接口都需要认证
templateRoutes.use('*', authMiddleware);

// 获取所有模板
templateRoutes.get('/', (c: AuthContext) => templateController.getAllTemplates(c));

// 创建模板
templateRoutes.post('/', (c: AuthContext) => templateController.createTemplate(c));

// 更新模板
templateRoutes.put('/:id', (c: AuthContext) => templateController.updateTemplate(c));

// 删除模板
templateRoutes.delete('/:id', (c: AuthContext) => templateController.deleteTemplate(c));

// 使用模板创建记录
templateRoutes.post('/:id/use', (c: AuthContext) => templateController.useTemplate(c));

export { templateRoutes };
