import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType = 'page_view', pagePath = '/' } = body

    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || 'direct'

    try {
      await query(
        `INSERT INTO analytics (event_type, page_path, user_agent, ip_address, referrer) 
         VALUES ($1, $2, $3, $4, $5)`,
        [eventType, pagePath, userAgent, ip, referrer]
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
