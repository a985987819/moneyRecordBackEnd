import { Hono } from 'hono';
import { recordController } from '../controllers/record.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const recordRoutes = new Hono();
// 所有记账接口都需要认证
recordRoutes.use('*', authMiddleware);
// 统计相关
recordRoutes.get('/stats', (c) => recordController.getMonthlyStats(c));
recordRoutes.get('/report', (c) => recordController.getReport(c));
// 账单筛选
recordRoutes.get('/bills', (c) => recordController.getBills(c));
recordRoutes.get('/filter', (c) => recordController.getBills(c)); // 兼容旧接口
// 记录查询
recordRoutes.get('/recent', (c) => recordController.getRecentRecords(c));
recordRoutes.get('/by-date', (c) => recordController.getRecordsByDate(c));
recordRoutes.get('/', (c) => recordController.getRecords(c));
// 批量导入
recordRoutes.post('/import', (c) => recordController.batchImport(c));
recordRoutes.delete('/import', (c) => recordController.deleteImportRecords(c));
// 定时记账
recordRoutes.post('/recurring', (c) => recordController.createRecurringRecords(c));
// 重复数据去重
recordRoutes.get('/duplicates/preview', (c) => recordController.previewDuplicates(c));
recordRoutes.delete('/duplicates', (c) => recordController.deduplicateRecords(c));
// CRUD
recordRoutes.post('/', (c) => recordController.createRecord(c));
recordRoutes.put('/:id', (c) => recordController.updateRecord(c));
recordRoutes.delete('/:id', (c) => recordController.deleteRecord(c));
export { recordRoutes };
//# sourceMappingURL=record.routes.js.map