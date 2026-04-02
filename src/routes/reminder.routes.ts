import { Hono } from 'hono';
import { reminderController } from '../controllers/reminder.controller';
import { authMiddleware, type AuthContext } from '../middleware/auth.middleware';

const reminderRoutes = new Hono();

reminderRoutes.use('*', authMiddleware);

// 获取所有提醒
reminderRoutes.get('/', (c: AuthContext) => reminderController.getAllReminders(c));

// 创建提醒
reminderRoutes.post('/', (c: AuthContext) => reminderController.createReminder(c));

// 更新提醒
reminderRoutes.put('/:id', (c: AuthContext) => reminderController.updateReminder(c));

// 删除提醒
reminderRoutes.delete('/:id', (c: AuthContext) => reminderController.deleteReminder(c));

// 切换启用/禁用状态
reminderRoutes.post('/:id/toggle', (c: AuthContext) => reminderController.toggleReminder(c));

export { reminderRoutes };
