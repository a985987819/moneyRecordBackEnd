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
const hostname = '0.0.0.0'

console.log(`Server is running on http://localhost:${port}`)
console.log(`Server is also accessible via network at http://0.0.0.0:${port}`)

Bun.serve({
  fetch: app.fetch,
  port,
  hostname,
})

export default app
