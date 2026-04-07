import { Response } from 'express'
import { AuthRequest, ApiResponse } from '../types'
import prisma from '../config/prisma'

// Kullanıcının kendi profilini getir (korumalı)
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Kullanıcı bulunamadı'
      } as ApiResponse)
    }

    return res.status(200).json({
      status: 'success',
      data: user
    } as ApiResponse)

  } catch (error) {
    console.error('Get profile error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    } as ApiResponse)
  }
}

// Admin: Tüm kullanıcıları listele
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            addresses: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.status(200).json({
      status: 'success',
      data: users
    } as ApiResponse)
  } catch (error) {
    console.error('Get all users error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    } as ApiResponse)
  }
}

// Admin: Kullanıcı detayı
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        addresses: {
          select: {
            id: true,
            title: true,
            city: true,
            district: true,
            isDefault: true
          }
        },
        _count: {
          select: {
            orders: true,
            addresses: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Kullanıcı bulunamadı'
      } as ApiResponse)
    }

    return res.status(200).json({
      status: 'success',
      data: user
    } as ApiResponse)
  } catch (error) {
    console.error('Get user by id error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    } as ApiResponse)
  }
}

// Admin: Kullanıcı rolü değiştir
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const { role } = req.body

    const validRoles = ['USER', 'ADMIN']
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Geçersiz rol'
      } as ApiResponse)
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return res.status(200).json({
      status: 'success',
      message: 'Kullanıcı rolü güncellendi',
      data: user
    } as ApiResponse)
  } catch (error) {
    console.error('Update user role error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    } as ApiResponse)
  }
}
