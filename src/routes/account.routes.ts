import { Hono } from 'hono';
import { accountController } from '../controllers/account.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import type { AuthVariables } from '../middleware/auth.middleware';

const accountRoutes = new Hono<{ Variables: AuthVariables }>();

accountRoutes.use('*', authMiddleware);

accountRoutes.get('/', (c) => accountController.getAllAccounts(c));

accountRoutes.get('/summary', (c) => accountController.getSummary(c));

accountRoutes.post('/', (c) => accountController.createAccount(c));

accountRoutes.put('/:id', (c) => accountController.updateAccount(c));

accountRoutes.delete('/:id', (c) => accountController.deleteAccount(c));

accountRoutes.post('/:id/adjust', (c) => accountController.adjustBalance(c));

export { accountRoutes };
