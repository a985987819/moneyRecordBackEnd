import { Hono } from 'hono';
import type { AuthVariables } from '../middleware/auth.middleware';
declare const recurringRoutes: Hono<{
    Variables: AuthVariables;
}, import("hono/types").BlankSchema, "/">;
export { recurringRoutes };
//# sourceMappingURL=recurring.routes.d.ts.map