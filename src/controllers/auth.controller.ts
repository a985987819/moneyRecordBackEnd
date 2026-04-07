import type { Context } from 'hono'
import { authService } from '../services/auth.service'
import { logger } from '../utils/logger'
import type { AuthContext } from '../middleware/auth.middleware'
import type { LoginRequest, RegisterRequest } from '../types/auth'

export class AuthController {
  // 用户注册
  async register(c: Context) {
    try {
      const body = await c.req.json<RegisterRequest>()

      if (!body.username || !body.password) {
        logger.warn('注册参数错误', { body })
        return c.json({ error: '用户名和密码不能为空' }, 400)
      }

      logger.info('用户注册', { username: body.username })
      const result = await authService.register(body)

      logger.info('用户注册成功', { userId: result.user.id })
      return c.json(result, 201)
    } catch (error) {
      const message = error instanceof Error ? error.message : '注册失败'
      logger.error('用户注册失败', error as Error)

      if (message === '用户名已存在') {
        return c.json({ error: message }, 409)
      }

      return c.json({ error: message }, 500)
    }
  }

  // 用户登录
  async login(c: Context) {
    try {
      const body = await c.req.json<LoginRequest>()

      if (!body.username || !body.password) {
        logger.warn('登录参数错误', { body })
        return c.json({ error: '用户名和密码不能为空' }, 400)
      }

      logger.info('用户登录', { username: body.username })
      const result = await authService.login(body)

      logger.info('用户登录成功', { userId: result.user.id })
      return c.json(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : '登录失败'
      logger.error('用户登录失败', error as Error)
      return c.json({ error: message }, 401)
    }
  }

  // 刷新 Token
  async refreshToken(c: Context) {
    try {
      const body = await c.req.json<{ refreshToken: string }>()

      if (!body.refreshToken) {
        logger.warn('刷新令牌参数错误')
        return c.json({ error: '刷新令牌不能为空' }, 400)
      }

      logger.info('刷新令牌')
      const result = await authService.refreshToken(body.refreshToken)

      logger.info('刷新令牌成功')
      return c.json(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : '刷新令牌失败'
      logger.error('刷新令牌失败', error as Error)
      return c.json({ error: message }, 401)
    }
  }

  // 用户登出
  async logout(c: Context) {
    try {
      const body = await c.req.json<{ refreshToken: string }>()

      if (!body.refreshToken) {
        logger.warn('登出参数错误')
        return c.json({ error: '刷新令牌不能为空' }, 400)
      }

      logger.info('用户登出')
      await authService.logout(body.refreshToken)

      logger.info('用户登出成功')
      return c.json({ message: '登出成功' })
    } catch (error) {
      logger.error('用户登出失败', error as Error)
      return c.json({ error: '登出失败' }, 500)
    }
  }

  // 从所有设备登出
  async logoutAll(c: AuthContext) {
    const user = c.get('user')

    try {
      logger.info('用户从所有设备登出', { userId: user.userId })
      await authService.logoutAll(user.userId)

      logger.info('用户从所有设备登出成功', { userId: user.userId })
      return c.json({ message: '已从所有设备登出' })
    } catch (error) {
      logger.error('用户从所有设备登出失败', error as Error, { userId: user.userId })
      return c.json({ error: '登出失败' }, 500)
    }
  }

  // 获取用户信息
  async getProfile(c: AuthContext) {
    const user = c.get('user')

    try {
      logger.info('获取用户信息', { userId: user.userId })
      return c.json({ userId: user.userId, username: user.username })
    } catch (error) {
      logger.error('获取用户信息失败', error as Error, { userId: user.userId })
      return c.json({ error: '获取用户信息失败' }, 500)
    }
  }
}

export const authController = new AuthController()
