import { db } from '../config/database'
import { hashPassword, verifyPassword } from '../utils/password'
import {
  generateAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
} from '../utils/token'
import { categoryService } from './category.service'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth'

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const existingUser = await db.query(
      'SELECT id FROM users WHERE username = $1',
      [data.username]
    )

    if (existingUser.rows.length > 0) {
      throw new Error('用户名已存在')
    }

    const hashedPassword = await hashPassword(data.password)

    const userResult = await db.query(
      `INSERT INTO users (username, password) 
       VALUES ($1, $2) 
       RETURNING id, username, created_at as "createdAt"`,
      [data.username, hashedPassword]
    )

    const user = userResult.rows[0]

    await categoryService.initDefaultCategories(user.id)

    const accessToken = generateAccessToken({
      userId: user.id,
      username: user.username,
    })
    const refreshToken = await createRefreshToken(user.id)

    return {
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 7200,
        tokenType: 'Bearer',
      },
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const userResult = await db.query(
      'SELECT id, username, password, created_at as "createdAt" FROM users WHERE username = $1',
      [data.username]
    )

    if (userResult.rows.length === 0) {
      throw new Error('用户名或密码错误')
    }

    const user = userResult.rows[0]
    const isPasswordValid = await verifyPassword(data.password, user.password)

    if (!isPasswordValid) {
      throw new Error('用户名或密码错误')
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      username: user.username,
    })
    const refreshToken = await createRefreshToken(user.id)

    return {
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 7200,
        tokenType: 'Bearer',
      },
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const tokenRecord = await verifyRefreshToken(refreshToken)

    if (!tokenRecord) {
      throw new Error('无效的刷新令牌')
    }

    await revokeRefreshToken(refreshToken)

    const accessToken = generateAccessToken({
      userId: tokenRecord.user.id,
      username: tokenRecord.user.username,
    })
    const newRefreshToken = await createRefreshToken(tokenRecord.user.id)

    return {
      user: {
        id: tokenRecord.user.id,
        username: tokenRecord.user.username,
        createdAt: tokenRecord.user.createdAt,
      },
      tokens: {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 7200,
        tokenType: 'Bearer',
      },
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await revokeRefreshToken(refreshToken)
  }

  async logoutAll(userId: number): Promise<void> {
    await revokeAllUserRefreshTokens(userId)
  }
}

export const authService = new AuthService()
