// Auth Types
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  name: string
  password: string
  attributes: AccountAttribute[]
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface User {
  id: number
  name: string
  attributes: AccountAttribute[]
  created_at: string
}

export enum AccountAttribute {
  ADMIN = 'admin'
}

// API Response Types
export interface ApiError {
  detail: string
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
}