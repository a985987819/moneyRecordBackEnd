import { Hono } from 'hono';
import { recurringController } from '../controllers/recurring.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const recurringRoutes = new Hono();
recurringRoutes.use('*', authMiddleware);
recurringRoutes.get('/', (c) => recurringController.getAllRecurring(c));
recurringRoutes.get('/summary', (c) => recurringController.getSummary(c));
recurringRoutes.post('/', (c) => recurringController.createRecurring(c));
recurringRoutes.put('/:id', (c) => recurringController.updateRecurring(c));
recurringRoutes.delete('/:id', (c) => recurringController.deleteRecurring(c));
recurringRoutes.post('/:id/toggle', (c) => recurringController.toggleRecurring(c));
export { recurringRoutes };
//# sourceMappingURL=recurring.routes.js.map