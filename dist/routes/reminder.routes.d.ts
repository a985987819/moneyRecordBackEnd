import { Hono } from 'hono';
import type { AuthVariables } from '../middleware/auth.middleware';
declare const reminderRoutes: Hono<{
    Variables: AuthVariables;
}, import("hono/types").BlankSchema, "/">;
export { reminderRoutes };
//# sourceMappingURL=reminder.routes.d.ts.map