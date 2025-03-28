import jwt from 'jsonwebtoken'
import { TokenPayload } from './types'

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret-key'


export function generateToken(payload: TokenPayload): string {
  return jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  )
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}