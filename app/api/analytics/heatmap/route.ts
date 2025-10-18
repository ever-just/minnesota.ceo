import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pagePath = searchParams.get('page') || '/'
    const period = searchParams.get('period') || 'month'

    const periodDays: Record<string, number> = {
      day: 1,
      week: 7,
      month: 30,
      year: 365
    }
    const days = periodDays[period] || 30

    const clickData = await query(`
      SELECT 
        x_position,
        y_position,
        viewport_width,
        viewport_height,
        element_id,
        element_class,
        element_tag,
        COUNT(*) as click_count
      FROM clicks
      WHERE page_path = $1
        AND created_at >= NOW() - INTERVAL '${days} days'
        AND x_position IS NOT NULL
        AND y_position IS NOT NULL
      GROUP BY x_position, y_position, viewport_width, viewport_height, element_id, element_class, element_tag
      ORDER BY click_count DESC
    `, [pagePath])

    const scrollData = await query(`
      SELECT 
        scroll_depth,
        COUNT(*) as count
      FROM page_views
      WHERE page_path = $1
        AND created_at >= NOW() - INTERVAL '${days} days'
        AND scroll_depth IS NOT NULL
      GROUP BY scroll_depth
      ORDER BY scroll_depth ASC
    `, [pagePath])

    const heatmapData = clickData.rows.map(row => ({
      x: row.x_position,
      y: row.y_position,
      value: row.click_count,
      viewport: {
        width: row.viewport_width,
        height: row.viewport_height
      },
      element: {
        id: row.element_id,
        class: row.element_class,
        tag: row.element_tag
      }
    }))

    return NextResponse.json({
      page: pagePath,
      period,
      clicks: heatmapData,
      scrollDepth: scrollData.rows,
      totalClicks: clickData.rows.reduce((sum, row) => sum + parseInt(row.click_count), 0)
    })
  } catch (error) {
    console.error('Heatmap data error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
