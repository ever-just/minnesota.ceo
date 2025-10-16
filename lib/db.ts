import { Pool, QueryResult, QueryResultRow } from 'pg'

// We'll use a connection pool for better performance
let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    
    if (!connectionString && process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_URL is not set')
    }

    // For development, we'll use a mock database
    if (!connectionString) {
      console.warn('DATABASE_URL not set, using mock data')
      // Return a mock pool for development
      return {
        query: async () => ({ rows: [], rowCount: 0 } as any),
        connect: async () => ({} as any),
        end: async () => {},
      } as any
    }

    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  
  return pool
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const pool = getPool()
  try {
    return await pool.query<T>(text, params)
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Initialize database tables
export async function initDatabase() {
  try {
    // Create waitlist table
    await query(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        source VARCHAR(50) DEFAULT 'main',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create nominations table
    await query(`
      CREATE TABLE IF NOT EXISTS nominations (
        id SERIAL PRIMARY KEY,
        nominee_name VARCHAR(255) NOT NULL,
        nominee_title VARCHAR(255),
        nominee_organization VARCHAR(255),
        category VARCHAR(100),
        reason TEXT,
        nominator_name VARCHAR(255),
        nominator_email VARCHAR(255),
        nominator_phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create analytics table
    await query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        page_path VARCHAR(255),
        user_agent TEXT,
        ip_address VARCHAR(45),
        referrer TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create admin_sessions table
    await query(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id SERIAL PRIMARY KEY,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      )
    `)

    console.log('Database tables initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}
