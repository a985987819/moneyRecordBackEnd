import { Hono } from 'hono';
import { categoryController } from '../controllers/category.controller';
import { authMiddleware, type AuthContext } from '../middleware/auth.middleware';

const categoryRoutes = new Hono();

categoryRoutes.use('*', authMiddleware);

categoryRoutes.get('/expense', (c: AuthContext) => categoryController.getExpenseCategories(c));
categoryRoutes.get('/income', (c: AuthContext) => categoryController.getIncomeCategories(c));
categoryRoutes.get('/', (c: AuthContext) => categoryController.getAllCategories(c));
categoryRoutes.post('/', (c: AuthContext) => categoryController.createCategory(c));
categoryRoutes.put('/:id', (c: AuthContext) => categoryController.updateCategory(c));
categoryRoutes.delete('/:id', (c: AuthContext) => categoryController.deleteCategory(c));

export { categoryRoutes };
