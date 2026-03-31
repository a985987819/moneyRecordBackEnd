import type { Context, Next } from 'hono'
import { verifyAccessToken } from '../utils/token'
import { db } from '../config/database'
import { logger } from '../utils/logger'

export interface AuthContext extends Context {
  Variables: {
    user: {
      userId: number
      username: string
    }
  }
}

export async function authMiddleware(c: AuthContext, next: Next) {
  const authHeader = c.req.header('Authorization')
  const path = c.req.path
  const method = c.req.method

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`认证失败: 未提供令牌`, { method, path })
    return c.json({ error: '未提供认证令牌' }, 401)
  }

  const token = authHeader.substring(7)

  try {
    const payload = verifyAccessToken(token)

    if (payload.type !== 'access') {
      logger.warn(`认证失败: 无效令牌类型`, { method, path, userId: payload.userId })
      return c.json({ error: '无效的令牌类型' }, 401)
    }

    const userResult = await db.query(
      'SELECT id FROM users WHERE id = $1',
      [payload.userId]
    )

    if (userResult.rows.length === 0) {
      logger.warn(`认证失败: 用户不存在`, { method, path, userId: payload.userId })
      return c.json({ error: '用户不存在' }, 401)
    }

    c.set('user', {
      userId: payload.userId,
      username: payload.username,
    })

    logger.debug(`认证成功`, { method, path, userId: payload.userId, username: payload.username })
    await next()
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      logger.warn(`认证失败: 令牌已过期`, { method, path })
      return c.json({ error: '令牌已过期', code: 'TOKEN_EXPIRED' }, 401)
    }
    logger.error(`认证失败: 无效令牌`, error as Error, { method, path })
    return c.json({ error: '无效的令牌' }, 401)
  }
}
