import { Hono } from 'hono';
import { reminderController } from '../controllers/reminder.controller';
import { authMiddleware } from '../middleware/auth.middleware';
const reminderRoutes = new Hono();
reminderRoutes.use('*', authMiddleware);
reminderRoutes.get('/', (c) => reminderController.getAllReminders(c));
reminderRoutes.post('/', (c) => reminderController.createReminder(c));
reminderRoutes.put('/:id', (c) => reminderController.updateReminder(c));
reminderRoutes.delete('/:id', (c) => reminderController.deleteReminder(c));
reminderRoutes.post('/:id/toggle', (c) => reminderController.toggleReminder(c));
export { reminderRoutes };
//# sourceMappingURL=reminder.routes.js.map