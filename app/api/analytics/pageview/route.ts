import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      session_id,
      visitor_id,
      page_path,
      page_title,
      referrer,
      time_on_page,
      scroll_depth
    } = body

    if (!session_id || !visitor_id || !page_path) {
      return NextResponse.json(
        { error: 'session_id, visitor_id, and page_path are required' },
        { status: 400 }
      )
    }

    await query(
      `INSERT INTO page_views (
        session_id, visitor_id, page_path, page_title, referrer, time_on_page, scroll_depth
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [session_id, visitor_id, page_path, page_title, referrer, time_on_page, scroll_depth]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Page view tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
