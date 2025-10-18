import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      session_id,
      visitor_id,
      ip_address,
      country,
      region,
      city,
      latitude,
      longitude,
      user_agent,
      device_type,
      browser,
      os,
      referrer,
      landing_page,
      exit_page,
      page_count,
      started_at,
      ended_at,
      duration_seconds
    } = body

    if (!session_id || !visitor_id) {
      return NextResponse.json(
        { error: 'session_id and visitor_id are required' },
        { status: 400 }
      )
    }

    const existing = await query(
      'SELECT id FROM sessions WHERE session_id = $1',
      [session_id]
    )

    if (existing.rows.length > 0) {
      await query(
        `UPDATE sessions SET
          exit_page = $1,
          page_count = $2,
          ended_at = $3,
          duration_seconds = $4
        WHERE session_id = $5`,
        [exit_page, page_count, ended_at, duration_seconds, session_id]
      )
    } else {
      await query(
        `INSERT INTO sessions (
          session_id, visitor_id, ip_address, country, region, city,
          latitude, longitude, user_agent, device_type, browser, os,
          referrer, landing_page, started_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          session_id, visitor_id, ip_address, country, region, city,
          latitude, longitude, user_agent, device_type, browser, os,
          referrer, landing_page, started_at
        ]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Session tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
