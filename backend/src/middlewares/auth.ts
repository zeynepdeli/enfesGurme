import { Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { AuthRequest, ApiResponse } from '../types'

// Access token doğrulama middleware'i
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('🔍 Middleware çalıştı')
    console.log('📦 Cookies:', req.cookies)
    
    // Cookie'den access token'ı al
    const accessToken = req.cookies.accessToken

    console.log('🎫 Access Token:', accessToken ? 'Var' : 'YOK')

    if (!accessToken) {
      console.log('❌ Token bulunamadı')
      return res.status(401).json({
        status: 'error',
        message: 'Token bulunamadı'
      } as ApiResponse)
    }

    // Token'ı doğrula
    const decoded = verifyAccessToken(accessToken)

    console.log('🔓 Decoded:', decoded)

    if (!decoded) {
      console.log('❌ Token geçersiz')
      return res.status(401).json({
        status: 'error',
        message: 'Geçersiz veya süresi dolmuş token'
      } as ApiResponse)
    }

    // Kullanıcı bilgilerini req.user'a ekle
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    }

    console.log('✅ User bilgisi eklendi:', req.user)

    // Sonraki middleware'e veya controller'a geç
    next()

  } catch (error) {
    console.error('🔥 Auth middleware error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    } as ApiResponse)
  }
}
