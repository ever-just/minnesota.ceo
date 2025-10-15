#!/usr/bin/env node

const { Pool } = require('pg');

// Database connection URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('Please set DATABASE_URL environment variable');
  console.error('Example: DATABASE_URL=postgresql://user:pass@host:port/db node scripts/init-database.js');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
});

async function initDatabase() {
  console.log('🚀 Initializing MINNESOTA.CEO Database...\n');

  try {
    // Create waitlist table
    console.log('Creating waitlist table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        source VARCHAR(50) DEFAULT 'main',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Waitlist table created');

    // Create nominations table
    console.log('Creating nominations table...');
    await pool.query(`
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
    `);
    console.log('✅ Nominations table created');

    // Create analytics table
    console.log('Creating analytics table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(50) NOT NULL,
        page_path VARCHAR(255),
        user_agent TEXT,
        ip_address VARCHAR(45),
        referrer TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Analytics table created');

    // Create admin_sessions table
    console.log('Creating admin_sessions table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id SERIAL PRIMARY KEY,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      )
    `);
    console.log('✅ Admin sessions table created');

    // Add indexes for better performance
    console.log('\nAdding indexes...');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_nominations_created_at ON nominations(created_at)');
    console.log('✅ Indexes created');

    // Insert some sample data for testing
    console.log('\nInserting sample data...');
    
    // Add sample waitlist entry
    await pool.query(`
      INSERT INTO waitlist (email, source) 
      VALUES ('test@example.com', 'initial-setup')
      ON CONFLICT (email) DO NOTHING
    `);
    
    // Add sample nomination
    await pool.query(`
      INSERT INTO nominations (
        nominee_name, nominee_title, nominee_organization, category, reason,
        nominator_name, nominator_email
      ) VALUES (
        'Sample Leader', 'CEO', 'Example Corporation', 'Business Leaders',
        'Outstanding leadership in Minnesota business community',
        'Admin Test', 'admin@test.com'
      )
      ON CONFLICT DO NOTHING
    `);
    
    // Add sample analytics
    await pool.query(`
      INSERT INTO analytics (event_type, page_path)
      VALUES ('page_view', '/'), ('page_view', '/app'), ('page_view', '/admin')
    `);
    
    console.log('✅ Sample data inserted');

    // Show table counts
    console.log('\n📊 Database Status:');
    const waitlistCount = await pool.query('SELECT COUNT(*) FROM waitlist');
    console.log(`  - Waitlist entries: ${waitlistCount.rows[0].count}`);
    
    const nominationsCount = await pool.query('SELECT COUNT(*) FROM nominations');
    console.log(`  - Nominations: ${nominationsCount.rows[0].count}`);
    
    const analyticsCount = await pool.query('SELECT COUNT(*) FROM analytics');
    console.log(`  - Analytics events: ${analyticsCount.rows[0].count}`);

    console.log('\n✅ Database initialization complete!');
    console.log('🌐 Your database is ready to use with MINNESOTA.CEO\n');

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run initialization
initDatabase();
