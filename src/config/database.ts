import { Pool, PoolClient } from 'pg'
import { env } from './env'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
})

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  getClient: (): Promise<PoolClient> => pool.connect(),
}

export const initDatabase = async () => {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        token VARCHAR(255) UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('expense', 'income', 'transfer', 'debt', 'reimbursement')),
        color VARCHAR(20),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS records (
        id SERIAL PRIMARY KEY,
        type VARCHAR(10) NOT NULL CHECK (type IN ('expense', 'income')),
        category VARCHAR(50) NOT NULL,
        sub_category VARCHAR(50),
        category_icon VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        remark TEXT,
        date DATE NOT NULL,
        account VARCHAR(50) NOT NULL,
        is_import BOOLEAN DEFAULT FALSE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS budgets (
        id SERIAL PRIMARY KEY,
        year INTEGER NOT NULL,
        month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
        amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        spent DECIMAL(10, 2) NOT NULL DEFAULT 0,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, year, month)
      )
    `)

    // 储蓄目标表
    await client.query(`
      CREATE TABLE IF NOT EXISTS savings_goals (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        target_amount DECIMAL(10, 2) NOT NULL,
        current_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        deadline DATE,
        icon VARCHAR(50) NOT NULL,
        color VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 储蓄交易记录表
    await client.query(`
      CREATE TABLE IF NOT EXISTS savings_transactions (
        id SERIAL PRIMARY KEY,
        goal_id INTEGER REFERENCES savings_goals(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdraw')),
        amount DECIMAL(10, 2) NOT NULL,
        remark TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 周期记账表
    await client.query(`
      CREATE TABLE IF NOT EXISTS recurring_records (
        id SERIAL PRIMARY KEY,
        type VARCHAR(10) NOT NULL CHECK (type IN ('expense', 'income')),
        category VARCHAR(50) NOT NULL,
        sub_category VARCHAR(50),
        category_icon VARCHAR(50),
        amount DECIMAL(10, 2) NOT NULL,
        remark TEXT,
        frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
        start_date DATE NOT NULL,
        end_date DATE,
        next_execute_date DATE NOT NULL,
        account VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 借贷管理表
    await client.query(`
      CREATE TABLE IF NOT EXISTS debts (
        id SERIAL PRIMARY KEY,
        type VARCHAR(10) NOT NULL CHECK (type IN ('lend', 'borrow')),
        person_name VARCHAR(100) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        repaid_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        remaining_amount DECIMAL(10, 2) NOT NULL,
        date DATE NOT NULL,
        expected_repay_date DATE,
        remark TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'repaid')),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 借贷还款记录表
    await client.query(`
      CREATE TABLE IF NOT EXISTS debt_repayments (
        id SERIAL PRIMARY KEY,
        debt_id INTEGER REFERENCES debts(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        remark TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 账户管理表
    await client.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('cash', 'bank', 'alipay', 'wechat', 'credit', 'other')),
        icon VARCHAR(50) NOT NULL,
        balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
        initial_balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
        is_default BOOLEAN DEFAULT FALSE,
        color VARCHAR(20),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 账户余额调整记录表
    await client.query(`
      CREATE TABLE IF NOT EXISTS account_adjustments (
        id SERIAL PRIMARY KEY,
        account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
        new_balance DECIMAL(10, 2) NOT NULL,
        remark TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 记账提醒表
    await client.query(`
      CREATE TABLE IF NOT EXISTS reminders (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
        time VARCHAR(10) NOT NULL,
        message TEXT,
        is_enabled BOOLEAN DEFAULT TRUE,
        days_of_week INTEGER[],
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 账单模板表
    await client.query(`
      CREATE TABLE IF NOT EXISTS record_templates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(10) NOT NULL CHECK (type IN ('expense', 'income')),
        category VARCHAR(50) NOT NULL,
        sub_category VARCHAR(50),
        category_icon VARCHAR(50),
        amount DECIMAL(10, 2),
        remark TEXT,
        account VARCHAR(50) NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 数据同步版本表
    await client.query(`
      CREATE TABLE IF NOT EXISTS sync_versions (
        id SERIAL PRIMARY KEY,
        version INTEGER NOT NULL,
        data JSONB NOT NULL,
        record_count INTEGER NOT NULL DEFAULT 0,
        size INTEGER NOT NULL DEFAULT 0,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 添加用户最后同步时间字段
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMP
    `)

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_records_user_id ON records(user_id);
      CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);
      CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
      CREATE INDEX IF NOT EXISTS idx_budgets_user_year_month ON budgets(user_id, year, month);
      CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON savings_goals(user_id);
      CREATE INDEX IF NOT EXISTS idx_recurring_records_user_id ON recurring_records(user_id);
      CREATE INDEX IF NOT EXISTS idx_debts_user_id ON debts(user_id);
      CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
      CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
      CREATE INDEX IF NOT EXISTS idx_templates_user_id ON record_templates(user_id);
      CREATE INDEX IF NOT EXISTS idx_sync_versions_user_id ON sync_versions(user_id);
    `)

    console.log('Database initialized successfully')
  } finally {
    client.release()
  }
}
