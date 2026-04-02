import { Hono } from 'hono';
import { budgetController } from '../controllers/budget.controller';
import { authMiddleware, type AuthContext } from '../middleware/auth.middleware';

const budgetRoutes = new Hono();

budgetRoutes.use('*', authMiddleware);

// 获取当前月预算
budgetRoutes.get('/current', (c: AuthContext) => budgetController.getCurrentBudget(c));

// 获取指定月份预算
budgetRoutes.get('/month', (c: AuthContext) => budgetController.getBudgetByMonth(c));

// 获取预算统计
budgetRoutes.get('/stats', (c: AuthContext) => budgetController.getBudgetStats(c));

// 获取最近几个月预算
budgetRoutes.get('/recent', (c: AuthContext) => budgetController.getRecentBudgets(c));

// 设置预算（创建或更新）
budgetRoutes.post('/', (c: AuthContext) => budgetController.setBudget(c));

// 删除预算
budgetRoutes.delete('/', (c: AuthContext) => budgetController.deleteBudget(c));

export { budgetRoutes };
