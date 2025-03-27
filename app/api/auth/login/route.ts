import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'
import { generateToken } from '@/lib/token'
import { TokenPayload } from '@/lib/types'
import * as z from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = loginSchema.parse(body)

    // Find user without password selection first
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true, // We need this for verification
        fullName: true,
        mobile: true,
      }
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create token payload (exclude password)
    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email
    }

    const token = generateToken(tokenPayload)

    // Create response with user data (excluding password)
    const responseUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      mobile: user.mobile
    }

    const response = NextResponse.json(
      { user: responseUser },
      { status: 200 }
    )

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    
    let errorMessage = 'Login failed'
    if (error instanceof z.ZodError) {
      errorMessage = error.errors.map(e => e.message).join(', ')
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}