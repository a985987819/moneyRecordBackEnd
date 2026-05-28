import { Hono } from 'hono';
import { categoryController } from '../controllers/category.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const categoryRoutes = new Hono();
// 所有分类接口都需要认证
categoryRoutes.use('*', authMiddleware);
categoryRoutes.get('/expense', (c) => categoryController.getExpenseCategories(c));
categoryRoutes.get('/income', (c) => categoryController.getIncomeCategories(c));
categoryRoutes.get('/', (c) => categoryController.getAllCategories(c));
categoryRoutes.post('/', (c) => categoryController.createCategory(c));
categoryRoutes.put('/:id', (c) => categoryController.updateCategory(c));
categoryRoutes.delete('/:id', (c) => categoryController.deleteCategory(c));
export { categoryRoutes };
//# sourceMappingURL=category.routes.js.map