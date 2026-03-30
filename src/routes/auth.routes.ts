import { Hono } from 'hono'
import { authController } from '../controllers/auth.controller'
import { authMiddleware, type AuthContext } from '../middleware/auth.middleware'

const authRoutes = new Hono()

authRoutes.post('/register', authController.register)
authRoutes.post('/login', authController.login)
authRoutes.post('/refresh', authController.refreshToken)
authRoutes.post('/logout', authController.logout)

authRoutes.use('/logout-all', authMiddleware)
authRoutes.post('/logout-all', (c: AuthContext) => authController.logoutAll(c))

authRoutes.use('/profile', authMiddleware)
authRoutes.get('/profile', (c: AuthContext) => authController.getProfile(c))

export { authRoutes }
