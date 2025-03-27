import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      }
    })
  } catch (error) {
    return NextResponse.json(
      { user: null, error: "Failed to fetch session" },
      { status: 500 }
    )
  }
}