import type { AuthContext } from '../middleware/auth.middleware'
import { budgetService } from '../services/budget.service'
import type { BudgetRequest } from '../types/budget'
import { logger } from '../utils/logger'
import { safeParseInt, validateAmount } from '../utils/validation'

export class BudgetController {
  // 获取当前月预算
  async getCurrentBudget(c: AuthContext) {
    const user = c.get('user')

    try {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1

      logger.info('获取当前月预算', { userId: user.userId, year, month })
      const budget = await budgetService.getBudget(user.userId, year, month)

      if (!budget) {
        return c.json({ budget: null, message: '本月尚未设置预算' })
      }

      return c.json({ budget })
    } catch (error) {
      logger.error('获取当前月预算失败', error as Error, { userId: user.userId })
      return c.json({ error: '获取预算失败' }, 500)
    }
  }

  // 获取指定月份预算
  async getBudgetByMonth(c: AuthContext) {
    const user = c.get('user')

    try {
      const query = c.req.query()
      const year = safeParseInt(query.year, new Date().getFullYear())
      const month = safeParseInt(query.month, new Date().getMonth() + 1)

      if (month < 1 || month > 12) {
        return c.json({ error: '月份必须在 1-12 之间' }, 400)
      }

      logger.info('获取指定月份预算', { userId: user.userId, year, month })
      const budget = await budgetService.getBudget(user.userId, year, month)

      if (!budget) {
        return c.json({ budget: null, message: '该月份尚未设置预算' })
      }

      return c.json({ budget })
    } catch (error) {
      logger.error('获取指定月份预算失败', error as Error, { userId: user.userId })
      return c.json({ error: '获取预算失败' }, 500)
    }
  }

  // 设置预算
  async setBudget(c: AuthContext) {
    const user = c.get('user')

    try {
      const body = await c.req.json<BudgetRequest>()

      if (!validateAmount(body.amount)) {
        logger.warn('设置预算参数错误', { userId: user.userId, body })
        return c.json({ error: '预算金额必须是非负数' }, 400)
      }

      logger.info('设置预算', { userId: user.userId, body })
      const budget = await budgetService.setBudget(user.userId, body)

      logger.info('设置预算成功', { userId: user.userId, budgetId: budget.id })
      return c.json({ budget, message: '预算设置成功' })
    } catch (error) {
      logger.error('设置预算失败', error as Error, { userId: user.userId })
      return c.json({ error: '设置预算失败' }, 500)
    }
  }

  // 删除预算
  async deleteBudget(c: AuthContext) {
    const user = c.get('user')

    try {
      const query = c.req.query()
      const year = safeParseInt(query.year, 0)
      const month = safeParseInt(query.month, 0)

      if (!year || !month || month < 1 || month > 12) {
        return c.json({ error: '请提供有效的年份和月份' }, 400)
      }

      logger.info('删除预算', { userId: user.userId, year, month })
      const deleted = await budgetService.deleteBudget(user.userId, year, month)

      if (!deleted) {
        return c.json({ error: '该月份预算不存在' }, 404)
      }

      logger.info('删除预算成功', { userId: user.userId, year, month })
      return c.json({ message: '预算删除成功' })
    } catch (error) {
      logger.error('删除预算失败', error as Error, { userId: user.userId })
      return c.json({ error: '删除预算失败' }, 500)
    }
  }

  // 获取预算统计
  async getBudgetStats(c: AuthContext) {
    const user = c.get('user')

    try {
      logger.info('获取预算统计', { userId: user.userId })
      const stats = await budgetService.getBudgetStats(user.userId)
      return c.json(stats)
    } catch (error) {
      logger.error('获取预算统计失败', error as Error, { userId: user.userId })
      return c.json({ error: '获取统计失败' }, 500)
    }
  }

  // 获取最近几个月预算
  async getRecentBudgets(c: AuthContext) {
    const user = c.get('user')

    try {
      const query = c.req.query()
      const months = safeParseInt(query.months, 6)

      logger.info('获取最近几个月预算', { userId: user.userId, months })
      const budgets = await budgetService.getRecentBudgets(user.userId, months)
      return c.json({ budgets })
    } catch (error) {
      logger.error('获取最近几个月预算失败', error as Error, { userId: user.userId })
      return c.json({ error: '获取预算列表失败' }, 500)
    }
  }
}

export const budgetController = new BudgetController()
