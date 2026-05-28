import { Hono } from 'hono';
import type { AuthVariables } from '../middleware/auth.middleware';
declare const savingsRoutes: Hono<{
    Variables: AuthVariables;
}, import("hono/types").BlankSchema, "/">;
export { savingsRoutes };
//# sourceMappingURL=savings.routes.d.ts.map