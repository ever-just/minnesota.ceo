#!/usr/bin/env node

const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('Please set DATABASE_URL environment variable');
  console.error('Example: DATABASE_URL=postgresql://user:pass@host:port/db node scripts/migrate-analytics.js');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
  query_timeout: 30000,
  statement_timeout: 30000
});

async function migrateAnalytics() {
  console.log('🚀 Starting Analytics Database Migration...\n');

  try {
    console.log('Creating sessions table...');
    await pool.query(`
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
    `);
    console.log('✅ Sessions table created');

    console.log('Creating page_views table...');
    await pool.query(`
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
    `);
    console.log('✅ Page views table created');

    console.log('Creating clicks table...');
    await pool.query(`
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
    `);
    console.log('✅ Clicks table created');

    console.log('Creating conversions table...');
    await pool.query(`
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
    `);
    console.log('✅ Conversions table created');

    console.log('\nCreating indexes...');
    
    await pool.query('CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON sessions(visitor_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_sessions_country ON sessions(country)');
    
    await pool.query('CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at)');
    
    await pool.query('CREATE INDEX IF NOT EXISTS idx_clicks_session_id ON clicks(session_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_clicks_page_path ON clicks(page_path)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON clicks(created_at)');
    
    await pool.query('CREATE INDEX IF NOT EXISTS idx_conversions_session_id ON conversions(session_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_conversions_type ON conversions(conversion_type)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_conversions_completed ON conversions(completed)');
    
    console.log('✅ All indexes created');

    // Show table counts
    console.log('\n📊 Database Status:');
    const sessionsCount = await pool.query('SELECT COUNT(*) FROM sessions');
    console.log(`  - Sessions: ${sessionsCount.rows[0].count}`);
    
    const pageViewsCount = await pool.query('SELECT COUNT(*) FROM page_views');
    console.log(`  - Page views: ${pageViewsCount.rows[0].count}`);
    
    const clicksCount = await pool.query('SELECT COUNT(*) FROM clicks');
    console.log(`  - Clicks: ${clicksCount.rows[0].count}`);
    
    const conversionsCount = await pool.query('SELECT COUNT(*) FROM conversions');
    console.log(`  - Conversions: ${conversionsCount.rows[0].count}`);

    console.log('\n✅ Analytics migration complete!');
    console.log('🌐 Your enhanced analytics system is ready to use\n');

  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrateAnalytics();
