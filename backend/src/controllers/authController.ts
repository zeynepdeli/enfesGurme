import { Request, Response } from 'express'
import prisma from '../config/prisma'
import { hashPassword, comparePassword } from '../utils/password'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { setAuthCookies, clearAuthCookies } from '../utils/cookie'
import { ApiResponse, RegisterRequest, LoginRequest } from '../types'

// Yardımcı fonksiyon: Refresh token'ı veritabanına kaydet
const saveRefreshToken = async (userId: string, token: string) => {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 1) // 1 gün sonra

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt
    }
  })
}

// Yardımcı fonksiyon: Kullanıcının eski refresh token'larını sil
const revokeOldRefreshTokens = async (userId: string) => {
  await prisma.refreshToken.deleteMany({
    where: {
      userId,
      expiresAt: {
        lt: new Date() // Süresi dolmuş token'ları sil
      }
    }
  })
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body as RegisterRequest

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Bu email zaten kayıtlı'
      } as ApiResponse)
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER'
      }
    })

    // Token'ları üret
    const accessToken = generateAccessToken(user.id, user.email, user.role)
    const refreshToken = generateRefreshToken(user.id)
    
    // Refresh token'ı veritabanına kaydet
    await saveRefreshToken(user.id, refreshToken)
    
    // Cookie'lere ekle
    setAuthCookies(res, accessToken, refreshToken)

    return res.status(201).json({
      status: 'success',
      message: 'Kayıt başarılı',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    } as ApiResponse)

  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    } as ApiResponse)
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest

    const user = await prisma.user.findUnique({
      where: { email }
    })

    const dummyHash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIq.Rg3Km6'
    const isPasswordValid = await comparePassword(
      password, 
      user ? user.password : dummyHash
    )

    if (!user || !isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Email veya şifre hatalı'
      } as ApiResponse)
    }

    // Eski refresh token'ları temizle
    await revokeOldRefreshTokens(user.id)

    // Yeni token'lar üret
    const accessToken = generateAccessToken(user.id, user.email, user.role)
    const refreshToken = generateRefreshToken(user.id)
    
    // Refresh token'ı veritabanına kaydet
    await saveRefreshToken(user.id, refreshToken)
    
    // Cookie'lere ekle
    setAuthCookies(res, accessToken, refreshToken)

    return res.status(200).json({
      status: 'success',
      message: 'Giriş başarılı',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    } as ApiResponse)

  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    } as ApiResponse)
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken

    // Refresh token varsa veritabanından sil
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
      })
    }

    // Cookie'leri temizle
    clearAuthCookies(res)

    return res.status(200).json({
      status: 'success',
      message: 'Çıkış başarılı'
    } as ApiResponse)

  } catch (error) {
    console.error('Logout error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    } as ApiResponse)
  }
}

export const refresh = async (req: Request, res: Response) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken

    if (!oldRefreshToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token bulunamadı'
      } as ApiResponse)
    }

    // Token'ı JWT olarak doğrula
    const decoded = verifyRefreshToken(oldRefreshToken)

    if (!decoded) {
      return res.status(401).json({
        status: 'error',
        message: 'Geçersiz refresh token'
      } as ApiResponse)
    }

    // Token veritabanında var mı ve geçerli mi kontrol et
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: oldRefreshToken },
      include: { user: true }
    })

    if (!storedToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token bulunamadı'
      } as ApiResponse)
    }

    // Token süresi dolmuş mu kontrol et
    if (storedToken.expiresAt < new Date()) {
      // Süresi dolmuş token'ı sil
      await prisma.refreshToken.delete({
        where: { id: storedToken.id }
      })

      return res.status(401).json({
        status: 'error',
        message: 'Refresh token süresi dolmuş'
      } as ApiResponse)
    }

    const user = storedToken.user

    // ESKİ refresh token'ı sil (Rotation için)
    await prisma.refreshToken.delete({
      where: { id: storedToken.id }
    })

    // YENİ token'lar üret (hem access hem refresh)
    const newAccessToken = generateAccessToken(user.id, user.email, user.role)
    const newRefreshToken = generateRefreshToken(user.id)

    // Yeni refresh token'ı veritabanına kaydet
    await saveRefreshToken(user.id, newRefreshToken)

    // Her iki token'ı da cookie'ye koy
    setAuthCookies(res, newAccessToken, newRefreshToken)

    return res.status(200).json({
      status: 'success',
      message: 'Token yenilendi'
    } as ApiResponse)

  } catch (error) {
    console.error('Refresh error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    } as ApiResponse)
  }
}
