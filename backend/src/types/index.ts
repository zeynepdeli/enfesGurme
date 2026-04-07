import { Request } from 'express'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  message?: string
  data?: T
}
