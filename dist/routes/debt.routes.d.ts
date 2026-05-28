import { Hono } from 'hono';
import type { AuthVariables } from '../middleware/auth.middleware';
declare const debtRoutes: Hono<{
    Variables: AuthVariables;
}, import("hono/types").BlankSchema, "/">;
export { debtRoutes };
//# sourceMappingURL=debt.routes.d.ts.map