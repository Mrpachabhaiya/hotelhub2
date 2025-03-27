import { User } from '@prisma/client'

export type SafeUser = Omit<User, 'password'> & {
  id: string
  email: string
  fullName: string | null
  mobile: string | null
  createdAt: Date
}

export type TokenPayload = {
    id: string
    email: string
}