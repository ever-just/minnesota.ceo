import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      session_id,
      visitor_id,
      page_path,
      element_id,
      element_class,
      element_tag,
      element_text,
      x_position,
      y_position,
      viewport_width,
      viewport_height
    } = body

    if (!session_id || !visitor_id || !page_path) {
      return NextResponse.json(
        { error: 'session_id, visitor_id, and page_path are required' },
        { status: 400 }
      )
    }

    await query(
      `INSERT INTO clicks (
        session_id, visitor_id, page_path, element_id, element_class,
        element_tag, element_text, x_position, y_position,
        viewport_width, viewport_height
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        session_id, visitor_id, page_path, element_id, element_class,
        element_tag, element_text, x_position, y_position,
        viewport_width, viewport_height
      ]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Click tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
