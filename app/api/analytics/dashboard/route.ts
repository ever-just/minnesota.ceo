import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let dateFilter = ''
    if (startDate && endDate) {
      dateFilter = `AND created_at BETWEEN '${startDate}' AND '${endDate}'`
    } else {
      const periodDays: Record<string, number> = {
        day: 1,
        week: 7,
        month: 30,
        year: 365
      }
      const days = periodDays[period] || 30
      dateFilter = `AND created_at >= NOW() - INTERVAL '${days} days'`
    }

    const sessionStats = await query(`
      SELECT 
        COUNT(DISTINCT session_id) as total_sessions,
        COUNT(DISTINCT visitor_id) as unique_visitors,
        AVG(duration_seconds) as avg_duration,
        AVG(page_count) as avg_pages_per_session
      FROM sessions
      WHERE 1=1 ${dateFilter}
    `)

    const pageViewStats = await query(`
      SELECT 
        COUNT(*) as total_page_views,
        AVG(time_on_page) as avg_time_on_page,
        AVG(scroll_depth) as avg_scroll_depth
      FROM page_views
      WHERE 1=1 ${dateFilter}
    `)

    const conversionStats = await query(`
      SELECT 
        conversion_type,
        COUNT(*) as total,
        SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed,
        ROUND(100.0 * SUM(CASE WHEN completed THEN 1 ELSE 0 END) / COUNT(*), 2) as completion_rate
      FROM conversions
      WHERE 1=1 ${dateFilter}
      GROUP BY conversion_type
    `)

    const topPages = await query(`
      SELECT 
        page_path,
        COUNT(*) as views,
        COUNT(DISTINCT visitor_id) as unique_visitors,
        AVG(time_on_page) as avg_time,
        AVG(scroll_depth) as avg_scroll
      FROM page_views
      WHERE 1=1 ${dateFilter}
      GROUP BY page_path
      ORDER BY views DESC
      LIMIT 10
    `)

    const geoData = await query(`
      SELECT 
        country,
        COUNT(DISTINCT session_id) as sessions,
        COUNT(DISTINCT visitor_id) as visitors
      FROM sessions
      WHERE country IS NOT NULL ${dateFilter}
      GROUP BY country
      ORDER BY sessions DESC
      LIMIT 20
    `)

    const deviceData = await query(`
      SELECT 
        device_type,
        COUNT(DISTINCT session_id) as sessions
      FROM sessions
      WHERE device_type IS NOT NULL ${dateFilter}
      GROUP BY device_type
    `)

    const browserData = await query(`
      SELECT 
        browser,
        COUNT(DISTINCT session_id) as sessions
      FROM sessions
      WHERE browser IS NOT NULL ${dateFilter}
      GROUP BY browser
      ORDER BY sessions DESC
      LIMIT 10
    `)

    const trafficOverTime = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT session_id) as sessions,
        COUNT(DISTINCT visitor_id) as visitors
      FROM sessions
      WHERE 1=1 ${dateFilter}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `)

    const bounceRate = await query(`
      SELECT 
        ROUND(100.0 * COUNT(CASE WHEN page_count <= 1 THEN 1 END) / COUNT(*), 2) as bounce_rate
      FROM sessions
      WHERE 1=1 ${dateFilter}
    `)

    const recentActivity = await query(`
      SELECT 
        s.session_id,
        s.visitor_id,
        s.country,
        s.city,
        s.device_type,
        s.landing_page,
        s.page_count,
        s.duration_seconds,
        s.started_at
      FROM sessions s
      WHERE 1=1 ${dateFilter}
      ORDER BY s.started_at DESC
      LIMIT 20
    `)

    return NextResponse.json({
      period,
      dateRange: { startDate, endDate },
      overview: {
        totalSessions: parseInt(sessionStats.rows[0]?.total_sessions || '0'),
        uniqueVisitors: parseInt(sessionStats.rows[0]?.unique_visitors || '0'),
        totalPageViews: parseInt(pageViewStats.rows[0]?.total_page_views || '0'),
        avgDuration: Math.round(sessionStats.rows[0]?.avg_duration || 0),
        avgPagesPerSession: parseFloat(sessionStats.rows[0]?.avg_pages_per_session || '0').toFixed(2),
        avgTimeOnPage: Math.round(pageViewStats.rows[0]?.avg_time_on_page || 0),
        avgScrollDepth: Math.round(pageViewStats.rows[0]?.avg_scroll_depth || 0),
        bounceRate: parseFloat(bounceRate.rows[0]?.bounce_rate || '0')
      },
      conversions: conversionStats.rows,
      topPages: topPages.rows,
      geographic: geoData.rows,
      devices: deviceData.rows,
      browsers: browserData.rows,
      trafficOverTime: trafficOverTime.rows,
      recentActivity: recentActivity.rows
    })
  } catch (error) {
    console.error('Dashboard data error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
