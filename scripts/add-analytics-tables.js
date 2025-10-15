const { Pool } = require('pg');

// Database connection URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('Please set DATABASE_URL environment variable');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
});

async function addAnalyticsTables() {
  console.log('🚀 Adding enhanced analytics tables...\n');

  try {
    // Create enhanced analytics table
    console.log('Creating enhanced analytics table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        page_path VARCHAR(255),
        event_value TEXT,
        event_category VARCHAR(100),
        user_agent TEXT,
        ip_address VARCHAR(45),
        referrer TEXT,
        screen_resolution VARCHAR(20),
        viewport_size VARCHAR(20),
        session_id VARCHAR(100),
        visitor_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Analytics events table created');

    // Create sessions table
    console.log('Creating sessions table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(100) UNIQUE NOT NULL,
        visitor_id VARCHAR(100),
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP,
        duration_seconds INTEGER,
        pages_viewed INTEGER DEFAULT 0,
        bounce BOOLEAN DEFAULT false,
        referrer TEXT,
        entry_page VARCHAR(255),
        exit_page VARCHAR(255),
        browser VARCHAR(100),
        os VARCHAR(100),
        device_type VARCHAR(50),
        country VARCHAR(2),
        region VARCHAR(100),
        city VARCHAR(100)
      )
    `);
    console.log('✅ Sessions table created');

    // Create page views table
    console.log('Creating page views table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_pageviews (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(100),
        visitor_id VARCHAR(100),
        page_path VARCHAR(255) NOT NULL,
        page_title VARCHAR(255),
        referrer TEXT,
        time_on_page INTEGER,
        scroll_depth INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Page views table created');

    // Create visitors table
    console.log('Creating visitors table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_visitors (
        id SERIAL PRIMARY KEY,
        visitor_id VARCHAR(100) UNIQUE NOT NULL,
        first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total_sessions INTEGER DEFAULT 1,
        total_pageviews INTEGER DEFAULT 0,
        user_id VARCHAR(100),
        user_properties JSONB
      )
    `);
    console.log('✅ Visitors table created');

    // Create conversions table
    console.log('Creating conversions table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_conversions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(100),
        visitor_id VARCHAR(100),
        conversion_type VARCHAR(50) NOT NULL,
        conversion_value DECIMAL(10, 2),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Conversions table created');

    // Create real-time analytics table
    console.log('Creating real-time analytics table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_realtime (
        id SERIAL PRIMARY KEY,
        visitor_id VARCHAR(100),
        session_id VARCHAR(100),
        page_path VARCHAR(255),
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )
    `);
    console.log('✅ Real-time analytics table created');

    // Create cookie preferences table
    console.log('Creating cookie preferences table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cookie_preferences (
        id SERIAL PRIMARY KEY,
        visitor_id VARCHAR(100) UNIQUE NOT NULL,
        necessary BOOLEAN DEFAULT true,
        analytics BOOLEAN DEFAULT false,
        marketing BOOLEAN DEFAULT false,
        consent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Cookie preferences table created');

    // Create push subscriptions table
    console.log('Creating push subscriptions table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS push_subscriptions (
        id SERIAL PRIMARY KEY,
        visitor_id VARCHAR(100),
        endpoint TEXT UNIQUE NOT NULL,
        keys_auth VARCHAR(255),
        keys_p256dh VARCHAR(255),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )
    `);
    console.log('✅ Push subscriptions table created');

    // Add indexes for better performance
    console.log('\nAdding performance indexes...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_events_visitor ON analytics_events (visitor_id);
      CREATE INDEX IF NOT EXISTS idx_events_session ON analytics_events (session_id);
      CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events (event_type);
      CREATE INDEX IF NOT EXISTS idx_events_created ON analytics_events (created_at);
      CREATE INDEX IF NOT EXISTS idx_pageviews_visitor ON analytics_pageviews (visitor_id);
      CREATE INDEX IF NOT EXISTS idx_pageviews_session ON analytics_pageviews (session_id);
      CREATE INDEX IF NOT EXISTS idx_pageviews_path ON analytics_pageviews (page_path);
      CREATE INDEX IF NOT EXISTS idx_sessions_visitor ON analytics_sessions (visitor_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_started ON analytics_sessions (started_at);
      CREATE INDEX IF NOT EXISTS idx_visitors_user ON analytics_visitors (user_id);
      CREATE INDEX IF NOT EXISTS idx_conversions_type ON analytics_conversions (conversion_type);
      CREATE INDEX IF NOT EXISTS idx_realtime_active ON analytics_realtime (is_active);
    `);
    console.log('✅ Indexes created');

    // Create materialized views for analytics dashboard
    console.log('\nCreating materialized views...');
    
    // Daily stats view
    await pool.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_daily_stats AS
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT visitor_id) as unique_visitors,
        COUNT(*) as total_pageviews,
        COUNT(DISTINCT session_id) as total_sessions
      FROM analytics_events
      WHERE event_type = 'page_view'
      GROUP BY DATE(created_at)
    `);
    
    // Top pages view
    await pool.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS analytics_top_pages AS
      SELECT 
        page_path,
        COUNT(*) as views,
        COUNT(DISTINCT visitor_id) as unique_visitors
      FROM analytics_events
      WHERE event_type = 'page_view'
      GROUP BY page_path
      ORDER BY views DESC
    `);
    
    console.log('✅ Materialized views created');

    console.log('\n📊 Analytics Database Status:');
    const tableCount = await pool.query(`
      SELECT COUNT(*) FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'analytics_%'
    `);
    console.log(`  - Analytics tables: ${tableCount.rows[0].count}`);

    console.log('\n✅ Enhanced analytics setup complete!');
    console.log('🌐 Your analytics system is ready');

  } catch (error) {
    console.error('❌ Error setting up analytics:', error);
  } finally {
    await pool.end();
  }
}

addAnalyticsTables();
