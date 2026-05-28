import { Hono } from 'hono';
import { savingsController } from '../controllers/savings.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import type { AuthVariables } from '../middleware/auth.middleware';

const savingsRoutes = new Hono<{ Variables: AuthVariables }>();

savingsRoutes.use('*', authMiddleware);

savingsRoutes.get('/goals', (c) => savingsController.getAllGoals(c));

savingsRoutes.get('/summary', (c) => savingsController.getSummary(c));

savingsRoutes.post('/goals', (c) => savingsController.createGoal(c));

savingsRoutes.put('/goals/:id', (c) => savingsController.updateGoal(c));

savingsRoutes.delete('/goals/:id', (c) => savingsController.deleteGoal(c));

savingsRoutes.post('/goals/:id/deposit', (c) => savingsController.deposit(c));

savingsRoutes.post('/goals/:id/withdraw', (c) => savingsController.withdraw(c));

export { savingsRoutes };
