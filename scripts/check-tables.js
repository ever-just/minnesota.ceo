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

async function checkTables() {
  try {
    console.log('Checking database tables...\n');

    // List all tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📋 Tables found:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    console.log('\n📊 Table data counts:');
    
    // Check each table for data
    for (const row of tables.rows) {
      const tableName = row.table_name;
      try {
        const count = await pool.query(`SELECT COUNT(*) FROM ${tableName}`);
        console.log(`  ${tableName}: ${count.rows[0].count} rows`);
        
        // Show sample data
        const sample = await pool.query(`SELECT * FROM ${tableName} LIMIT 2`);
        if (sample.rows.length > 0) {
          console.log(`    Sample:`, JSON.stringify(sample.rows[0], null, 2));
        }
      } catch (err) {
        console.log(`  ${tableName}: Error - ${err.message}`);
      }
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkTables();

