export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

export interface UserResponse {
  id: number
  username: string
  createdAt: Date
}

export interface AuthResponse {
  user: UserResponse
  tokens: TokenResponse
}
