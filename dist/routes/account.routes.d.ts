import { Hono } from 'hono';
import type { AuthVariables } from '../middleware/auth.middleware';
declare const accountRoutes: Hono<{
    Variables: AuthVariables;
}, import("hono/types").BlankSchema, "/">;
export { accountRoutes };
//# sourceMappingURL=account.routes.d.ts.map