import { Hono } from 'hono';
import type { AuthVariables } from '../middleware/auth.middleware';
declare const templateRoutes: Hono<{
    Variables: AuthVariables;
}, import("hono/types").BlankSchema, "/">;
export { templateRoutes };
//# sourceMappingURL=template.routes.d.ts.map