import { Hono } from 'hono';
import { debtController } from '../controllers/debt.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import type { AuthContext } from '../middleware/auth.middleware';

const debtRoutes = new Hono();

// 所有借贷接口都需要认证
debtRoutes.use('*', authMiddleware);

// 获取所有借贷记录
debtRoutes.get('/', (c: AuthContext) => debtController.getAllDebts(c));

// 获取借贷统计
debtRoutes.get('/summary', (c: AuthContext) => debtController.getSummary(c));

// 创建借贷记录
debtRoutes.post('/', (c: AuthContext) => debtController.createDebt(c));

// 更新借贷记录
debtRoutes.put('/:id', (c: AuthContext) => debtController.updateDebt(c));

// 删除借贷记录
debtRoutes.delete('/:id', (c: AuthContext) => debtController.deleteDebt(c));

// 记录还款
debtRoutes.post('/:id/repay', (c: AuthContext) => debtController.repay(c));

export { debtRoutes };
