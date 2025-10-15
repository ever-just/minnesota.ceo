import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      event_type = 'page_view',
      page_path = '/',
      event_value,
      event_category,
      user_agent,
      referrer,
      screen_resolution,
      viewport_size,
      session_id,
      visitor_id
    } = body

    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const ua = user_agent || request.headers.get('user-agent') || 'unknown'
    const ref = referrer || request.headers.get('referer') || 'direct'

    try {
      // Insert into new analytics_events table
      await query(
        `INSERT INTO analytics_events (
          event_type, page_path, event_value, event_category,
          user_agent, ip_address, referrer, 
          screen_resolution, viewport_size,
          session_id, visitor_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          event_type, page_path, event_value, event_category,
          ua, ip, ref,
          screen_resolution, viewport_size,
          session_id, visitor_id
        ]
      )

      // Update visitor record
      if (visitor_id) {
        await query(
          `INSERT INTO analytics_visitors (visitor_id, last_seen, total_pageviews) 
           VALUES ($1, NOW(), 1)
           ON CONFLICT (visitor_id) 
           DO UPDATE SET 
             last_seen = NOW(),
             total_pageviews = analytics_visitors.total_pageviews + 1`,
          [visitor_id]
        )
      }

      // Track real-time activity
      if (session_id && visitor_id) {
        await query(
          `INSERT INTO analytics_realtime (visitor_id, session_id, page_path, last_activity, is_active)
           VALUES ($1, $2, $3, NOW(), true)
           ON CONFLICT (visitor_id) 
           DO UPDATE SET 
             session_id = $2,
             page_path = $3,
             last_activity = NOW(),
             is_active = true`,
          [visitor_id, session_id, page_path]
        )
      }

      // Clean up old real-time records (older than 5 minutes)
      await query(
        `UPDATE analytics_realtime 
         SET is_active = false 
         WHERE last_activity < NOW() - INTERVAL '5 minutes'`
      )

    } catch (dbError) {
      console.log('Analytics tracking skipped:', dbError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get analytics summary - requires admin authentication in production
    const url = new URL(request.url)
    const period = url.searchParams.get('period') || 'day'

    let dateFilter = "created_at > NOW() - INTERVAL '1 day'"
    if (period === 'week') {
      dateFilter = "created_at > NOW() - INTERVAL '7 days'"
    } else if (period === 'month') {
      dateFilter = "created_at > NOW() - INTERVAL '30 days'"
    }

    // Get visitor count
    const visitorResult = await query(
      `SELECT COUNT(DISTINCT ip_address) as unique_visitors,
              COUNT(*) as total_views
       FROM analytics 
       WHERE event_type = 'page_view' AND ${dateFilter}`
    )

    // Get waitlist count
    const waitlistResult = await query(
      `SELECT COUNT(*) as count FROM waitlist WHERE ${dateFilter}`
    )

    // Get nominations count  
    const nominationsResult = await query(
      `SELECT COUNT(*) as count FROM nominations WHERE ${dateFilter}`
    )

    // Get top pages
    const pagesResult = await query(
      `SELECT page_path, COUNT(*) as views 
       FROM analytics 
       WHERE event_type = 'page_view' AND ${dateFilter}
       GROUP BY page_path 
       ORDER BY views DESC 
       LIMIT 10`
    )

    return NextResponse.json({
      period,
      visitors: {
        unique: visitorResult.rows[0]?.unique_visitors || 0,
        total: visitorResult.rows[0]?.total_views || 0,
      },
      waitlist: waitlistResult.rows[0]?.count || 0,
      nominations: nominationsResult.rows[0]?.count || 0,
      topPages: pagesResult.rows || [],
    })
  } catch (error) {
    // Return mock data if database is not configured
    return NextResponse.json({
      period: 'day',
      visitors: { unique: 0, total: 0 },
      waitlist: 0,
      nominations: 0,
      topPages: [],
    })
  }
}
