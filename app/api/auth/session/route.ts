import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic' // Prevent caching
export const revalidate = 0 // Ensure fresh data

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    const response = NextResponse.json(
      { 
        user: user ? {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          mobile: user.mobile,
          role: user.role,
          // Include any other user fields you need
        } : null
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'CDN-Cache-Control': 'no-store',
          'Vary': 'Cookie' // Important for different user sessions
        }
      }
    )

    // Ensure client-side can't cache this response
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    
    return response

  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { 
        user: null, 
        error: "Failed to fetch session" 
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    )
  }
}