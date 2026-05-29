import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRoutes } from '../../src/routes/auth.routes'
import { categoryRoutes } from '../../src/routes/category.routes'
import { recordRoutes } from '../../src/routes/record.routes'
import { budgetRoutes } from '../../src/routes/budget.routes'
import { savingsRoutes } from '../../src/routes/savings.routes'
import { recurringRoutes } from '../../src/routes/recurring.routes'
import { debtRoutes } from '../../src/routes/debt.routes'
import { accountRoutes } from '../../src/routes/account.routes'
import { reminderRoutes } from '../../src/routes/reminder.routes'
import { templateRoutes } from '../../src/routes/template.routes'
import { syncRoutes } from '../../src/routes/sync.routes'
import { db, initDatabase } from '../../src/config/database'
import { logger } from '../../src/utils/logger'

const app = new Hono()

const corsOrigin = process.env.CORS_ORIGIN || '*'

app.use('*', cors({
  origin: corsOrigin,
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

let initialized = false

async function ensureInitialized() {
  if (!initialized) {
    try {
      await initDatabase()
      logger.info(`数据库初始化成功`)
      initialized = true
    } catch (error) {
      logger.error(`数据库初始化失败`, error as Error)
      throw error
    }
  }
}

export default async function onRequest(context: any) {
  await ensureInitialized()
  return app.fetch(context.request)
}
