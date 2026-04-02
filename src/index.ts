import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRoutes } from './routes/auth.routes'
import { categoryRoutes } from './routes/category.routes'
import { recordRoutes } from './routes/record.routes'
import { budgetRoutes } from './routes/budget.routes'
import { savingsRoutes } from './routes/savings.routes'
import { recurringRoutes } from './routes/recurring.routes'
import { debtRoutes } from './routes/debt.routes'
import { accountRoutes } from './routes/account.routes'
import { reminderRoutes } from './routes/reminder.routes'
import { templateRoutes } from './routes/template.routes'
import { syncRoutes } from './routes/sync.routes'
import { db, initDatabase } from './config/database'
import { logger } from './utils/logger'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.use('*', async (c, next) => {
  const start = Date.now()
  const method = c.req.method
  const path = c.req.path

  logger.info(`请求开始`, { method, path })

  try {
    await next()
  } catch (error) {
    logger.error(`请求处理异常`, error as Error, { method, path })
    throw error
  }

  const duration = Date.now() - start
  const status = c.res.status

  logger.request(method, path, status, duration)
})

app.get('/', (c) => {
  return c.json({
    message: 'Money Backend API',
    version: '1.0.0',
  })
})

app.route('/api/auth', authRoutes)
app.route('/api/categories', categoryRoutes)
app.route('/api/records', recordRoutes)
app.route('/api/budgets', budgetRoutes)
app.route('/api/savings', savingsRoutes)
app.route('/api/recurring', recurringRoutes)
app.route('/api/debts', debtRoutes)
app.route('/api/accounts', accountRoutes)
app.route('/api/reminders', reminderRoutes)
app.route('/api/templates', templateRoutes)
app.route('/api/sync', syncRoutes)

app.get('/health', async (c) => {
  try {
    await db.query('SELECT 1')
    logger.debug(`健康检查通过`)
    return c.json({ status: 'healthy', database: 'connected' })
  } catch (error) {
    logger.error(`健康检查失败`, error as Error)
    return c.json({ status: 'unhealthy', database: 'disconnected' }, 500)
  }
})

const port = 9876
const hostname = '0.0.0.0'

logger.info(`服务器启动`, { port, hostname })

initDatabase().then(() => {
  logger.info(`数据库初始化成功`)
  Bun.serve({
    fetch: app.fetch,
    port,
    hostname,
    idleTimeout: 60, // 设置超时时间为60秒
  })
}).catch((error) => {
  logger.error(`数据库初始化失败`, error)
  process.exit(1)
})
