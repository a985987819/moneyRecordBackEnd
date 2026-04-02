import { Hono } from 'hono';
import { syncController } from '../controllers/sync.controller';
import { authMiddleware, type AuthContext } from '../middleware/auth.middleware';

const syncRoutes = new Hono();

syncRoutes.use('*', authMiddleware);

// 上传数据到云端
syncRoutes.post('/upload', (c: AuthContext) => syncController.uploadData(c));

// 从云端下载数据
syncRoutes.get('/download', (c: AuthContext) => syncController.downloadData(c));

// 获取历史版本列表
syncRoutes.get('/versions', (c: AuthContext) => syncController.getVersions(c));

// 恢复到指定版本
syncRoutes.post('/restore/:versionId', (c: AuthContext) => syncController.restoreVersion(c));

export { syncRoutes };
