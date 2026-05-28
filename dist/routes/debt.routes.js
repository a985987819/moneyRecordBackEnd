import { Hono } from 'hono';
import { debtController } from '../controllers/debt.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const debtRoutes = new Hono();
debtRoutes.use('*', authMiddleware);
debtRoutes.get('/', (c) => debtController.getAllDebts(c));
debtRoutes.get('/summary', (c) => debtController.getSummary(c));
debtRoutes.post('/', (c) => debtController.createDebt(c));
debtRoutes.put('/:id', (c) => debtController.updateDebt(c));
debtRoutes.delete('/:id', (c) => debtController.deleteDebt(c));
debtRoutes.post('/:id/repay', (c) => debtController.repay(c));
export { debtRoutes };
//# sourceMappingURL=debt.routes.js.map