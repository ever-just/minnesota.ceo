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

    // Create sessions table for enhanced analytics
    await query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        visitor_id VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45),
        country VARCHAR(100),
        region VARCHAR(100),
        city VARCHAR(100),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        user_agent TEXT,
        device_type VARCHAR(50),
        browser VARCHAR(100),
        os VARCHAR(100),
        referrer TEXT,
        landing_page VARCHAR(255),
        exit_page VARCHAR(255),
        page_count INTEGER DEFAULT 0,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP,
        duration_seconds INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create page_views table
    await query(`
      CREATE TABLE IF NOT EXISTS page_views (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        visitor_id VARCHAR(255) NOT NULL,
        page_path VARCHAR(255) NOT NULL,
        page_title VARCHAR(255),
        referrer TEXT,
        time_on_page INTEGER,
        scroll_depth INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create clicks table
    await query(`
      CREATE TABLE IF NOT EXISTS clicks (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        visitor_id VARCHAR(255) NOT NULL,
        page_path VARCHAR(255) NOT NULL,
        element_id VARCHAR(255),
        element_class VARCHAR(255),
        element_tag VARCHAR(50),
        element_text TEXT,
        x_position INTEGER,
        y_position INTEGER,
        viewport_width INTEGER,
        viewport_height INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create conversions table
    await query(`
      CREATE TABLE IF NOT EXISTS conversions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        visitor_id VARCHAR(255) NOT NULL,
        conversion_type VARCHAR(50) NOT NULL,
        conversion_value VARCHAR(255),
        funnel_step VARCHAR(100),
        completed BOOLEAN DEFAULT FALSE,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes for performance
    await query('CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON sessions(visitor_id)')
    await query('CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at)')
    await query('CREATE INDEX IF NOT EXISTS idx_sessions_country ON sessions(country)')
    await query('CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id)')
    await query('CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path)')
    await query('CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at)')
    await query('CREATE INDEX IF NOT EXISTS idx_clicks_session_id ON clicks(session_id)')
    await query('CREATE INDEX IF NOT EXISTS idx_clicks_page_path ON clicks(page_path)')
    await query('CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON clicks(created_at)')
    await query('CREATE INDEX IF NOT EXISTS idx_conversions_session_id ON conversions(session_id)')
    await query('CREATE INDEX IF NOT EXISTS idx_conversions_type ON conversions(conversion_type)')
    await query('CREATE INDEX IF NOT EXISTS idx_conversions_completed ON conversions(completed)')

    console.log('Database tables initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}
