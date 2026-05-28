import { Hono } from 'hono';
import { templateController } from '../controllers/template.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const templateRoutes = new Hono();
templateRoutes.use('*', authMiddleware);
templateRoutes.get('/', (c) => templateController.getAllTemplates(c));
templateRoutes.post('/', (c) => templateController.createTemplate(c));
templateRoutes.put('/:id', (c) => templateController.updateTemplate(c));
templateRoutes.delete('/:id', (c) => templateController.deleteTemplate(c));
templateRoutes.post('/:id/use', (c) => templateController.useTemplate(c));
export { templateRoutes };
//# sourceMappingURL=template.routes.js.map