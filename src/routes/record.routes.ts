import { Hono } from 'hono';
import { recordController } from '../controllers/record.controller';
import { authMiddleware, type AuthContext } from '../middleware/auth.middleware';

const recordRoutes = new Hono();

recordRoutes.use('*', authMiddleware);

// 统计相关
recordRoutes.get('/stats', (c: AuthContext) => recordController.getMonthlyStats(c));
recordRoutes.get('/report', (c: AuthContext) => recordController.getReport(c));

// 账单筛选
recordRoutes.get('/bills', (c: AuthContext) => recordController.getBills(c));

// 记录查询
recordRoutes.get('/recent', (c: AuthContext) => recordController.getRecentRecords(c));
recordRoutes.get('/by-date', (c: AuthContext) => recordController.getRecordsByDate(c));
recordRoutes.get('/', (c: AuthContext) => recordController.getRecords(c));

// 批量导入
recordRoutes.post('/import', (c: AuthContext) => recordController.batchImport(c));
recordRoutes.delete('/import', (c: AuthContext) => recordController.deleteImportRecords(c));

// CRUD
recordRoutes.post('/', (c: AuthContext) => recordController.createRecord(c));
recordRoutes.put('/:id', (c: AuthContext) => recordController.updateRecord(c));
recordRoutes.delete('/:id', (c: AuthContext) => recordController.deleteRecord(c));

export { recordRoutes };
