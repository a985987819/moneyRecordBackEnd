import { Hono } from 'hono';
import type { AuthVariables } from '../middleware/auth.middleware';
declare const budgetRoutes: Hono<{
    Variables: AuthVariables;
}, import("hono/types").BlankSchema, "/">;
export { budgetRoutes };
//# sourceMappingURL=budget.routes.d.ts.map