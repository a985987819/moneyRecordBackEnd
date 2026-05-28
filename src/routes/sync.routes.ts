import { Hono } from 'hono';
import { syncController } from '../controllers/sync.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import type { AuthVariables } from '../middleware/auth.middleware';

const syncRoutes = new Hono<{ Variables: AuthVariables }>();

syncRoutes.use('*', authMiddleware);

syncRoutes.post('/upload', (c) => syncController.uploadData(c));

syncRoutes.get('/download', (c) => syncController.downloadData(c));

syncRoutes.get('/versions', (c) => syncController.getVersions(c));

syncRoutes.post('/restore/:versionId', (c) => syncController.restoreVersion(c));

export { syncRoutes };
