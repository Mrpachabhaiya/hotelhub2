import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { verifyToken } from './token'
import prisma from './prisma'

// Server-side only functions
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}


export async function getCurrentUser() {
  const token = cookies().get('token')?.value
  if (!token) return null

  try {
    const decoded = verifyToken(token)
    return await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        mobile: true,
        role : true,
        createdAt: true
      }
    })
  } catch (error) {
    return null
  }
}

