import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const result = await query('SELECT NOW() as current_time, version() as db_version')
    
    // Get counts from each table
    const waitlistCount = await query('SELECT COUNT(*) as count FROM waitlist')
    const nominationsCount = await query('SELECT COUNT(*) as count FROM nominations')
    const analyticsCount = await query('SELECT COUNT(*) as count FROM analytics')
    
    return NextResponse.json({
      status: 'connected',
      database: {
        currentTime: result.rows[0]?.current_time,
        version: result.rows[0]?.db_version,
      },
      tables: {
        waitlist: waitlistCount.rows[0]?.count || 0,
        nominations: nominationsCount.rows[0]?.count || 0,
        analytics: analyticsCount.rows[0]?.count || 0,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...',
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      stack: error.stack,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
      }
    }, { status: 500 })
  }
}

