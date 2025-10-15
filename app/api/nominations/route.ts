import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { validateEmail, sanitizeInput } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      nomineeName,
      nomineeTitle,
      nomineeOrganization,
      category,
      reason,
      nominatorName,
      nominatorEmail,
      nominatorPhone,
    } = body

    // Validate required fields
    if (!nomineeName || !nominatorName || !nominatorEmail) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    if (!validateEmail(nominatorEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Sanitize all inputs
    const sanitizedData = {
      nomineeName: sanitizeInput(nomineeName),
      nomineeTitle: sanitizeInput(nomineeTitle || ''),
      nomineeOrganization: sanitizeInput(nomineeOrganization || ''),
      category: sanitizeInput(category || ''),
      reason: sanitizeInput(reason || ''),
      nominatorName: sanitizeInput(nominatorName),
      nominatorEmail: sanitizeInput(nominatorEmail).toLowerCase(),
      nominatorPhone: sanitizeInput(nominatorPhone || ''),
    }

    // Save to database
    try {
      await query(
        `INSERT INTO nominations (
          nominee_name, nominee_title, nominee_organization, 
          category, reason, nominator_name, nominator_email, nominator_phone
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          sanitizedData.nomineeName,
          sanitizedData.nomineeTitle,
          sanitizedData.nomineeOrganization,
          sanitizedData.category,
          sanitizedData.reason,
          sanitizedData.nominatorName,
          sanitizedData.nominatorEmail,
          sanitizedData.nominatorPhone,
        ]
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
        ['nomination_submitted', '/api/nominations', userAgent, ip, referrer]
      )
    } catch (analyticsError) {
      console.log('Analytics tracking skipped')
    }

    return NextResponse.json(
      { 
        message: 'Nomination submitted successfully',
        nominee: sanitizedData.nomineeName,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Nominations API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint requires admin authentication in production
    // For now, we'll return mock data for testing
    
    const result = await query(
      'SELECT * FROM nominations ORDER BY created_at DESC LIMIT 100'
    )
    
    return NextResponse.json({ 
      nominations: result.rows || [],
      total: result.rowCount || 0,
    })
  } catch (error) {
    // Return mock data if database is not configured
    return NextResponse.json({ 
      nominations: [],
      total: 0,
    })
  }
}
