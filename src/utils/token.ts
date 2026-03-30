import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { prisma } from '../config/database'
import crypto from 'crypto'

export interface TokenPayload {
  userId: number
  username: string
  type: 'access' | 'refresh'
}

export function generateAccessToken(payload: Omit<TokenPayload, 'type'>): string {
  return jwt.sign(
    { ...payload, type: 'access' },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  )
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(40).toString('hex')
}

export async function createRefreshToken(userId: number): Promise<string> {
  const token = generateRefreshToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  })

  return token
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload
}

export async function verifyRefreshToken(token: string) {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!refreshToken) {
    return null
  }

  if (new Date() > refreshToken.expiresAt) {
    await prisma.refreshToken.delete({ where: { token } })
    return null
  }

  return refreshToken
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: { token },
  })
}

export async function revokeAllUserRefreshTokens(userId: number): Promise<void> {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  })
}
