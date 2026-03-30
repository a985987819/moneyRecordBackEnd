import type { Context } from 'hono'
import { authService } from '../services/auth.service'
import type { LoginRequest, RegisterRequest } from '../types/auth'

export class AuthController {
  async register(c: Context) {
    try {
      const body = await c.req.json<RegisterRequest>()

      if (!body.username || !body.password) {
        return c.json({ error: '用户名和密码不能为空' }, 400)
      }

      if (body.username.length < 3 || body.username.length > 20) {
        return c.json({ error: '用户名长度必须在3-20个字符之间' }, 400)
      }

      if (body.password.length < 6) {
        return c.json({ error: '密码长度不能少于6个字符' }, 400)
      }

      const result = await authService.register(body)
      return c.json(result, 201)
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400)
      }
      return c.json({ error: '注册失败' }, 500)
    }
  }

  async login(c: Context) {
    try {
      const body = await c.req.json<LoginRequest>()

      if (!body.username || !body.password) {
        return c.json({ error: '用户名和密码不能为空' }, 400)
      }

      const result = await authService.login(body)
      return c.json(result)
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400)
      }
      return c.json({ error: '登录失败' }, 500)
    }
  }

  async refreshToken(c: Context) {
    try {
      const body = await c.req.json<{ refreshToken: string }>()

      if (!body.refreshToken) {
        return c.json({ error: '刷新令牌不能为空' }, 400)
      }

      const result = await authService.refreshToken(body.refreshToken)
      return c.json(result)
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 401)
      }
      return c.json({ error: '刷新令牌失败' }, 500)
    }
  }

  async logout(c: Context) {
    try {
      const body = await c.req.json<{ refreshToken: string }>()

      if (!body.refreshToken) {
        return c.json({ error: '刷新令牌不能为空' }, 400)
      }

      await authService.logout(body.refreshToken)
      return c.json({ message: '登出成功' })
    } catch (error) {
      return c.json({ error: '登出失败' }, 500)
    }
  }

  async logoutAll(c: Context) {
    try {
      const user = c.get('user')
      await authService.logoutAll(user.userId)
      return c.json({ message: '已从所有设备登出' })
    } catch (error) {
      return c.json({ error: '登出失败' }, 500)
    }
  }

  async getProfile(c: Context) {
    try {
      const user = c.get('user')
      return c.json({
        userId: user.userId,
        username: user.username,
      })
    } catch (error) {
      return c.json({ error: '获取用户信息失败' }, 500)
    }
  }
}

export const authController = new AuthController()
