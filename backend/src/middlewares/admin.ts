import { Response, NextFunction } from 'express'
import { AuthRequest, ApiResponse } from '../types'

// Sadece admin kullanıcılar erişebilir
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    console.log('🔐 Admin middleware çalıştı')
    console.log('👤 req.user:', req.user)
    
    // authenticate middleware'i zaten çalıştı, req.user dolu
    if (!req.user) {
      console.log('❌ User bilgisi yok')
      return res.status(401).json({
        status: 'error',
        message: 'Kimlik doğrulaması gerekli'
      } as ApiResponse)
    }

    console.log('🎭 User role:', req.user.role)

    // Kullanıcı admin mi kontrol et
    if (req.user.role !== 'ADMIN') {
      console.log('❌ Admin değil, role:', req.user.role)
      return res.status(403).json({
        status: 'error',
        message: 'Bu işlem için yetkiniz yok'
      } as ApiResponse)
    }

    console.log('✅ Admin, devam ediyor')
    // Admin ise devam et
    next()

  } catch (error) {
    console.error('Admin middleware error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    } as ApiResponse)
  }
}
