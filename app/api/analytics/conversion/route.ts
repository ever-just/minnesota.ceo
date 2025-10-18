import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      session_id,
      visitor_id,
      conversion_type,
      conversion_value,
      funnel_step,
      completed,
      metadata
    } = body

    if (!session_id || !visitor_id || !conversion_type) {
      return NextResponse.json(
        { error: 'session_id, visitor_id, and conversion_type are required' },
        { status: 400 }
      )
    }

    await query(
      `INSERT INTO conversions (
        session_id, visitor_id, conversion_type, conversion_value,
        funnel_step, completed, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        session_id, visitor_id, conversion_type, conversion_value,
        funnel_step, completed, metadata ? JSON.stringify(metadata) : null
      ]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Conversion tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
