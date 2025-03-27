import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    cookies().delete('token')
    
    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to logout' },
      { status: 500 }
    )
  }
}