import { Request, Response } from 'express'
import { AuthRequest, ApiResponse } from '../types'
import prisma from '../config/prisma'

// Tüm kategorileri listele (herkese açık)
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return res.status(200).json({
      status: 'success',
      data: categories
    } as ApiResponse)

  } catch (error) {
    console.error('Get categories error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    } as ApiResponse)
  }
}

// Tek kategori getir (herkese açık)
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          include: {
            images: {
              take: 1,
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    })

    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Kategori bulunamadı'
      } as ApiResponse)
    }

    return res.status(200).json({
      status: 'success',
      data: category
    } as ApiResponse)

  } catch (error) {
    console.error('Get category error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    } as ApiResponse)
  }
}

// Yeni kategori oluştur (sadece admin)
export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, description, image } = req.body

    if (!name || !slug) {
      return res.status(400).json({
        status: 'error',
        message: 'İsim ve slug gerekli'
      } as ApiResponse)
    }

    // Slug benzersiz mi kontrol et
    const existing = await prisma.category.findUnique({
      where: { slug }
    })

    if (existing) {
      return res.status(400).json({
        status: 'error',
        message: 'Bu slug zaten kullanılıyor'
      } as ApiResponse)
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image
      }
    })

    return res.status(201).json({
      status: 'success',
      message: 'Kategori başarıyla oluşturuldu',
      data: category
    } as ApiResponse)

  } catch (error) {
    console.error('Create category error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    } as ApiResponse)
  }
}

// Kategori güncelle (sadece admin)
export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string
    const { name, slug, description, image } = req.body

    const existing = await prisma.category.findUnique({
      where: { id }
    })

    if (!existing) {
      return res.status(404).json({
        status: 'error',
        message: 'Kategori bulunamadı'
      } as ApiResponse)
    }

    // Slug değiştiyse benzersiz mi kontrol et
    if (slug && slug !== existing.slug) {
      const slugInUse = await prisma.category.findUnique({
        where: { slug }
      })

      if (slugInUse) {
        return res.status(400).json({
          status: 'error',
          message: 'Bu slug zaten kullanılıyor'
        } as ApiResponse)
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image })
      }
    })

    return res.status(200).json({
      status: 'success',
      message: 'Kategori başarıyla güncellendi',
      data: category
    } as ApiResponse)

  } catch (error) {
    console.error('Update category error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    } as ApiResponse)
  }
}

// Kategori sil (sadece admin)
export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Kategori bulunamadı'
      } as ApiResponse)
    }

    // Kategoride ürün varsa silinmesin
    if (category._count.products > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Bu kategoride ${category._count.products} ürün var. Önce ürünleri başka kategoriye taşıyın.`
      } as ApiResponse)
    }

    await prisma.category.delete({
      where: { id }
    })

    return res.status(200).json({
      status: 'success',
      message: 'Kategori başarıyla silindi'
    } as ApiResponse)

  } catch (error) {
    console.error('Delete category error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Sunucu hatası'
    } as ApiResponse)
  }
}
