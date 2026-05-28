import { Hono } from 'hono';
import type { AuthVariables } from '../middleware/auth.middleware';
declare const syncRoutes: Hono<{
    Variables: AuthVariables;
}, import("hono/types").BlankSchema, "/">;
export { syncRoutes };
//# sourceMappingURL=sync.routes.d.ts.map