import { Hono } from 'hono';
import { budgetController } from '../controllers/budget.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import type { AuthVariables } from '../middleware/auth.middleware';

const budgetRoutes = new Hono<{ Variables: AuthVariables }>();

budgetRoutes.use('*', authMiddleware);

budgetRoutes.get('/current', (c) => budgetController.getCurrentBudget(c));

budgetRoutes.get('/month', (c) => budgetController.getBudgetByMonth(c));

budgetRoutes.get('/stats', (c) => budgetController.getBudgetStats(c));

budgetRoutes.get('/recent', (c) => budgetController.getRecentBudgets(c));

budgetRoutes.post('/', (c) => budgetController.setBudget(c));

budgetRoutes.delete('/', (c) => budgetController.deleteBudget(c));

export { budgetRoutes };
