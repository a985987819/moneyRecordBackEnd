import type { Context, Next } from 'hono'
import { verifyAccessToken } from '../utils/token'
import { prisma } from '../config/database'

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

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: '未提供认证令牌' }, 401)
  }

  const token = authHeader.substring(7)

  try {
    const payload = verifyAccessToken(token)

    if (payload.type !== 'access') {
      return c.json({ error: '无效的令牌类型' }, 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    })

    if (!user) {
      return c.json({ error: '用户不存在' }, 401)
    }

    c.set('user', {
      userId: payload.userId,
      username: payload.username,
    })

    await next()
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return c.json({ error: '令牌已过期', code: 'TOKEN_EXPIRED' }, 401)
    }
    return c.json({ error: '无效的令牌' }, 401)
  }
}
