import { Hono } from 'hono';
import { categoryController } from '../controllers/category.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import type { AuthContext } from '../middleware/auth.middleware';

const categoryRoutes = new Hono();

// 所有分类接口都需要认证
categoryRoutes.use('*', authMiddleware);

categoryRoutes.get('/expense', (c: AuthContext) => categoryController.getExpenseCategories(c));
categoryRoutes.get('/income', (c: AuthContext) => categoryController.getIncomeCategories(c));
categoryRoutes.get('/', (c: AuthContext) => categoryController.getAllCategories(c));
categoryRoutes.post('/', (c: AuthContext) => categoryController.createCategory(c));
categoryRoutes.put('/:id', (c: AuthContext) => categoryController.updateCategory(c));
categoryRoutes.delete('/:id', (c: AuthContext) => categoryController.deleteCategory(c));

export { categoryRoutes };
