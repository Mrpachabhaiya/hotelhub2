import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import * as z from 'zod'
import { generateToken } from '@/lib/token'
import { TokenPayload } from '@/lib/types'
export const dynamic = 'force-dynamic'; // Prevent static optimization
export const revalidate = 0;
const registerSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  mobile: z.string().min(10),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { fullName, email, password, mobile } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        mobile 
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        mobile: true,
        createdAt: true
      }
    })

    const token = generateToken({
      id: user.id,
      email: user.email
    } as TokenPayload)

    const response = NextResponse.json(
      { 
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          mobile: user.mobile,
          createdAt: user.createdAt
        }
      },
      { status: 201 }
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
    console.error('Registration error:', error)
    
    let errorMessage = 'Registration failed'
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