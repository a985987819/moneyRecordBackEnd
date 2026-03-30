import { Hono } from 'hono';
import { recordController } from '../controllers/record.controller';
import { authMiddleware, type AuthContext } from '../middleware/auth.middleware';

const recordRoutes = new Hono();

recordRoutes.use('*', authMiddleware);

recordRoutes.get('/stats', (c: AuthContext) => recordController.getMonthlyStats(c));
recordRoutes.get('/recent', (c: AuthContext) => recordController.getRecentRecords(c));
recordRoutes.get('/', (c: AuthContext) => recordController.getRecords(c));
recordRoutes.post('/', (c: AuthContext) => recordController.createRecord(c));
recordRoutes.put('/:id', (c: AuthContext) => recordController.updateRecord(c));
recordRoutes.delete('/:id', (c: AuthContext) => recordController.deleteRecord(c));

export { recordRoutes };
