import { Hono } from 'hono';
import { accountController } from '../controllers/account.controller';
import { authMiddleware, type AuthContext } from '../middleware/auth.middleware';

const accountRoutes = new Hono();

accountRoutes.use('*', authMiddleware);

// 获取所有账户
accountRoutes.get('/', (c: AuthContext) => accountController.getAllAccounts(c));

// 获取账户统计
accountRoutes.get('/summary', (c: AuthContext) => accountController.getSummary(c));

// 创建账户
accountRoutes.post('/', (c: AuthContext) => accountController.createAccount(c));

// 更新账户
accountRoutes.put('/:id', (c: AuthContext) => accountController.updateAccount(c));

// 删除账户
accountRoutes.delete('/:id', (c: AuthContext) => accountController.deleteAccount(c));

// 调整余额
accountRoutes.post('/:id/adjust', (c: AuthContext) => accountController.adjustBalance(c));

export { accountRoutes };
