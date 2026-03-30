import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRoutes } from './routes/auth.routes'
import { prisma } from './config/database'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.get('/', (c) => {
  return c.json({
    message: 'Money Backend API',
    version: '1.0.0',
  })
})

app.route('/api/auth', authRoutes)

app.get('/health', async (c) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return c.json({ status: 'healthy', database: 'connected' })
  } catch {
    return c.json({ status: 'unhealthy', database: 'disconnected' }, 500)
  }
})

const port = 3003
console.log(`Server is running on在这里 http://localhost:${port}`)

Bun.serve({
  fetch: app.fetch,
  port,
})

export default app
