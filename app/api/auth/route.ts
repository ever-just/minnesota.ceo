import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import bcrypt from 'bcryptjs'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'weldon'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Check password
    const isValid = password === ADMIN_PASSWORD || 
                   await bcrypt.compare(password, '$2a$10$YourHashedPasswordHere')

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Generate session token
    const sessionToken = Math.random().toString(36).substring(2) + Date.now().toString(36)
    
    // Store session in database
    try {
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      const userAgent = request.headers.get('user-agent') || 'unknown'
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      await query(
        `INSERT INTO admin_sessions (session_token, ip_address, user_agent, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [sessionToken, ip, userAgent, expiresAt]
      )
    } catch (dbError) {
      console.log('Session storage skipped:', dbError)
    }

    // Set session cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false })
    }

    // Verify session in database
    try {
      const result = await query(
        `SELECT * FROM admin_sessions 
         WHERE session_token = $1 AND expires_at > NOW()`,
        [sessionToken]
      )

      if (result.rows.length > 0) {
        return NextResponse.json({ authenticated: true })
      }
    } catch (dbError) {
      // If database is not configured, check for valid session token format
      if (sessionToken && sessionToken.length > 10) {
        return NextResponse.json({ authenticated: true })
      }
    }

    return NextResponse.json({ authenticated: false })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin_session')?.value

    if (sessionToken) {
      // Remove session from database
      try {
        await query(
          'DELETE FROM admin_sessions WHERE session_token = $1',
          [sessionToken]
        )
      } catch (dbError) {
        console.log('Session deletion skipped:', dbError)
      }
    }

    // Clear session cookie
    const response = NextResponse.json({ success: true })
    response.cookies.delete('admin_session')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
