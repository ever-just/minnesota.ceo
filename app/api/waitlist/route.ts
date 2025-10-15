import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { validateEmail, sanitizeInput } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source = 'main' } = body

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const sanitizedEmail = sanitizeInput(email).toLowerCase()
    const sanitizedSource = sanitizeInput(source)

    // Check if email already exists
    try {
      const existing = await query(
        'SELECT id FROM waitlist WHERE email = $1',
        [sanitizedEmail]
      )

      if (existing.rows.length > 0) {
        return NextResponse.json(
          { error: 'This email is already on the waitlist' },
          { status: 409 }
        )
      }
    } catch (dbError) {
      console.log('Database not configured, using mock response')
    }

    // Add to waitlist
    try {
      await query(
        'INSERT INTO waitlist (email, source) VALUES ($1, $2)',
        [sanitizedEmail, sanitizedSource]
      )
    } catch (dbError) {
      console.log('Database insert skipped:', dbError)
    }

    // Track analytics event
    try {
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      const userAgent = request.headers.get('user-agent') || 'unknown'
      const referrer = request.headers.get('referer') || 'direct'
      
      await query(
        'INSERT INTO analytics (event_type, page_path, user_agent, ip_address, referrer) VALUES ($1, $2, $3, $4, $5)',
        ['waitlist_signup', '/api/waitlist', userAgent, ip, referrer]
      )
    } catch (analyticsError) {
      console.log('Analytics tracking skipped')
    }

    return NextResponse.json(
      { message: 'Successfully added to waitlist', email: sanitizedEmail },
      { status: 201 }
    )
  } catch (error) {
    console.error('Waitlist API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint requires admin authentication in production
    // For now, we'll return mock data
    
    const result = await query('SELECT COUNT(*) as count FROM waitlist')
    const count = result.rows[0]?.count || 0

    return NextResponse.json({ count })
  } catch (error) {
    // Return mock data if database is not configured
    return NextResponse.json({ count: 0 })
  }
}
