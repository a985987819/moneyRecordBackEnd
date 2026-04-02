import { Hono } from 'hono';
import { savingsController } from '../controllers/savings.controller';
import { authMiddleware, type AuthContext } from '../middleware/auth.middleware';

const savingsRoutes = new Hono();

savingsRoutes.use('*', authMiddleware);

// 获取所有储蓄目标
savingsRoutes.get('/goals', (c: AuthContext) => savingsController.getAllGoals(c));

// 获取储蓄统计
savingsRoutes.get('/summary', (c: AuthContext) => savingsController.getSummary(c));

// 创建储蓄目标
savingsRoutes.post('/goals', (c: AuthContext) => savingsController.createGoal(c));

// 更新储蓄目标
savingsRoutes.put('/goals/:id', (c: AuthContext) => savingsController.updateGoal(c));

// 删除储蓄目标
savingsRoutes.delete('/goals/:id', (c: AuthContext) => savingsController.deleteGoal(c));

// 向目标存钱
savingsRoutes.post('/goals/:id/deposit', (c: AuthContext) => savingsController.deposit(c));

// 从目标取钱
savingsRoutes.post('/goals/:id/withdraw', (c: AuthContext) => savingsController.withdraw(c));

export { savingsRoutes };
