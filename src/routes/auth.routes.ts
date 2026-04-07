import { Hono } from 'hono'
import { authController } from '../controllers/auth.controller'
import type { AuthContext } from '../middleware/auth.middleware'
import { authMiddleware } from '../middleware/auth.middleware'

const authRoutes = new Hono()

// 公开接口 - 统一使用箭头函数包装
authRoutes.post('/register', (c) => authController.register(c))
authRoutes.post('/login', (c) => authController.login(c))
authRoutes.post('/refresh', (c) => authController.refreshToken(c))
authRoutes.post('/logout', (c) => authController.logout(c))

// 需要认证的接口 - 统一使用箭头函数包装
authRoutes.use('/logout-all', authMiddleware)
authRoutes.post('/logout-all', (c: AuthContext) => authController.logoutAll(c))

authRoutes.use('/profile', authMiddleware)
authRoutes.get('/profile', (c: AuthContext) => authController.getProfile(c))

export { authRoutes }
