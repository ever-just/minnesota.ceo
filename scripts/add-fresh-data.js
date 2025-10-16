#!/usr/bin/env node

const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function addFreshData() {
  try {
    console.log('Adding fresh data with current timestamps...\n');

    // Add fresh analytics events (today)
    await pool.query(`
      INSERT INTO analytics (event_type, page_path, user_agent, ip_address, referrer)
      VALUES 
        ('page_view', '/', 'Mozilla/5.0', '192.168.1.1', 'direct'),
        ('page_view', '/app', 'Mozilla/5.0', '192.168.1.2', 'direct'),
        ('page_view', '/admin', 'Mozilla/5.0', '192.168.1.3', 'direct'),
        ('page_view', '/', 'Mozilla/5.0', '192.168.1.4', 'google.com'),
        ('page_view', '/app', 'Mozilla/5.0', '192.168.1.5', 'direct')
    `);
    console.log('✅ Added 5 page views');

    // Add fresh waitlist entries
    await pool.query(`
      INSERT INTO waitlist (email, source)
      VALUES 
        ('john.doe@example.com', 'homepage'),
        ('jane.smith@example.com', 'homepage'),
        ('ceo@company.com', 'app-page')
      ON CONFLICT (email) DO NOTHING
    `);
    console.log('✅ Added 3 waitlist signups');

    // Add fresh nominations
    await pool.query(`
      INSERT INTO nominations (
        nominee_name, nominee_title, nominee_organization, 
        category, reason, nominator_name, nominator_email
      ) VALUES 
        (
          'Mary Johnson', 
          'CEO', 
          'Tech Innovations Inc', 
          'Technology Leaders',
          'Led major digital transformation initiative that created 500 jobs in Minnesota',
          'Board Member',
          'board@techinnovations.com'
        ),
        (
          'Robert Williams',
          'Founder & Chairman',
          'Williams Manufacturing',
          'Business Leaders', 
          'Built sustainable manufacturing practices and mentored 50+ startup founders',
          'Industry Colleague',
          'colleague@industry.org'
        )
    `);
    console.log('✅ Added 2 nominations');

    // Show counts
    console.log('\n📊 Updated Database Status:');
    const waitlistCount = await pool.query('SELECT COUNT(*) FROM waitlist');
    console.log(`  - Waitlist entries: ${waitlistCount.rows[0].count}`);
    
    const nominationsCount = await pool.query('SELECT COUNT(*) FROM nominations');
    console.log(`  - Nominations: ${nominationsCount.rows[0].count}`);
    
    const analyticsCount = await pool.query('SELECT COUNT(*) FROM analytics');
    console.log(`  - Analytics events: ${analyticsCount.rows[0].count}`);

    // Show today's counts
    console.log('\n📅 Today\'s Activity:');
    const todayAnalytics = await pool.query(`
      SELECT COUNT(*) FROM analytics 
      WHERE created_at > NOW() - INTERVAL '1 day'
    `);
    console.log(`  - Page views (last 24h): ${todayAnalytics.rows[0].count}`);
    
    const todayWaitlist = await pool.query(`
      SELECT COUNT(*) FROM waitlist 
      WHERE created_at > NOW() - INTERVAL '1 day'
    `);
    console.log(`  - Waitlist signups (last 24h): ${todayWaitlist.rows[0].count}`);
    
    const todayNominations = await pool.query(`
      SELECT COUNT(*) FROM nominations 
      WHERE created_at > NOW() - INTERVAL '1 day'
    `);
    console.log(`  - Nominations (last 24h): ${todayNominations.rows[0].count}`);

    console.log('\n✅ Fresh data added! Admin should now show these numbers.\n');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

addFreshData();

