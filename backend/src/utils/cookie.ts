import { Response } from 'express'

// Cookie ayarları - tek yerde tanımlı, her yerde kullanılır
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
  domain: process.env.NODE_ENV === 'development' ? 'localhost' : undefined,
  path: '/'
}

// Access ve Refresh token'ları cookie'ye ekle
export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  // Access token - 15 dakika
  res.cookie('accessToken', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000
  })
  
  // Refresh token - 1 gün
  res.cookie('refreshToken', refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 24 * 60 * 60 * 1000
  })
}

// Logout için - tüm auth cookie'leri temizle
export const clearAuthCookies = (res: Response) => {
  res.clearCookie('accessToken', COOKIE_OPTIONS)
  res.clearCookie('refreshToken', COOKIE_OPTIONS)
}
