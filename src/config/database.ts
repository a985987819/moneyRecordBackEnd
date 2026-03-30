import { Pool, PoolClient } from 'pg'
import { env } from './env'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
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
        category_icon VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        remark TEXT,
        date DATE NOT NULL,
        account VARCHAR(50) NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_records_user_id ON records(user_id);
      CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);
      CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
    `)

    console.log('Database initialized successfully')
  } finally {
    client.release()
  }
}
