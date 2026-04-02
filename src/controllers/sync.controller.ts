import type { Context } from 'hono';
import { syncService } from '../services/sync.service';
import { logger } from '../utils/logger';
import type { SyncData } from '../types/sync';

export class SyncController {
  // 上传数据
  async uploadData(c: Context) {
    const user = c.get('user');

    try {
      const body = await c.req.json<{ data: SyncData }>();

      if (!body.data) {
        logger.warn(`上传数据参数错误`, { userId: user.userId });
        return c.json({ error: '数据不能为空' }, 400);
      }

      logger.info(`上传同步数据`, { userId: user.userId });
      const result = await syncService.uploadData(user.userId, body.data);

      logger.info(`数据上传成功`, { userId: user.userId, version: result.version });
      return c.json({ ...result, syncedAt: new Date().toISOString() });
    } catch (error) {
      logger.error(`数据上传失败`, error as Error, { userId: user.userId });
      return c.json({ error: '数据上传失败' }, 500);
    }
  }

  // 下载数据
  async downloadData(c: Context) {
    const user = c.get('user');
    const version = c.req.query('version');

    try {
      logger.info(`下载同步数据`, { userId: user.userId, version });
      const result = await syncService.downloadData(
        user.userId,
        version ? parseInt(version) : undefined
      );

      logger.info(`数据下载成功`, { userId: user.userId, version: result.version });
      return c.json(result);
    } catch (error) {
      logger.error(`数据下载失败`, error as Error, { userId: user.userId });
      return c.json({ error: '数据下载失败' }, 500);
    }
  }

  // 获取历史版本
  async getVersions(c: Context) {
    const user = c.get('user');

    try {
      logger.info(`获取同步版本列表`, { userId: user.userId });
      const versions = await syncService.getVersions(user.userId);
      return c.json({ versions });
    } catch (error) {
      logger.error(`获取版本列表失败`, error as Error, { userId: user.userId });
      return c.json({ error: '获取版本列表失败' }, 500);
    }
  }

  // 恢复到指定版本
  async restoreVersion(c: Context) {
    const user = c.get('user');
    const versionId = c.req.param('versionId');

    try {
      logger.info(`恢复到指定版本`, { userId: user.userId, versionId });
      const result = await syncService.restoreVersion(user.userId, versionId);

      logger.info(`版本恢复成功`, { userId: user.userId, versionId });
      return c.json({
        ...result,
        message: '数据恢复成功',
      });
    } catch (error) {
      if (error instanceof Error && error.message === '版本不存在') {
        return c.json({ error: '版本不存在' }, 404);
      }
      logger.error(`版本恢复失败`, error as Error, { userId: user.userId, versionId });
      return c.json({ error: '版本恢复失败' }, 500);
    }
  }
}

export const syncController = new SyncController();
