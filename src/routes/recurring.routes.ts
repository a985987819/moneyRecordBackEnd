import { Hono } from 'hono';
import { recurringController } from '../controllers/recurring.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import type { AuthContext } from '../middleware/auth.middleware';

const recurringRoutes = new Hono();

// 所有周期记账接口都需要认证
recurringRoutes.use('*', authMiddleware);

// 获取所有周期记账
recurringRoutes.get('/', (c: AuthContext) => recurringController.getAllRecurring(c));

// 获取统计
recurringRoutes.get('/summary', (c: AuthContext) => recurringController.getSummary(c));

// 创建周期记账
recurringRoutes.post('/', (c: AuthContext) => recurringController.createRecurring(c));

// 更新周期记账
recurringRoutes.put('/:id', (c: AuthContext) => recurringController.updateRecurring(c));

// 删除周期记账
recurringRoutes.delete('/:id', (c: AuthContext) => recurringController.deleteRecurring(c));

// 切换启用/禁用状态
recurringRoutes.post('/:id/toggle', (c: AuthContext) => recurringController.toggleRecurring(c));

export { recurringRoutes };
