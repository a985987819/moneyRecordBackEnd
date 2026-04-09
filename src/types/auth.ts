/**
 * 认证模块类型定义
 */

/**
 * 用户信息
 */
export interface User {
  id: number;
  username: string;
  createdAt: string;
}

/**
 * JWT Token Payload
 */
export interface TokenPayload {
  userId: number;
  username: string;
  type: 'access' | 'refresh';
}

/**
 * 登录请求
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 注册请求
 */
export interface RegisterRequest {
  username: string;
  password: string;
}

/**
 * 认证响应
 */
export interface AuthResponse {
  user: {
    id: number;
    username: string;
    createdAt: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  };
}

/**
 * Token 刷新响应
 */
export interface RefreshTokenResponse {
  accessToken: string;
}

/**
 * 认证错误码
 */
export type AuthErrorCode = 
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'USERNAME_EXISTS'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'REFRESH_TOKEN_INVALID';
