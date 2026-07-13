import { Request, Response } from "express";
import { AuthRequest, ApiResponse } from "../types";
import prisma from "../config/prisma";

// Tüm ürünleri listele (arama ve filtreleme ile)
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      inStock,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (inStock === "true") {
      where.stock = { gt: 0 };
    }

    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder;

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy,
    });

    return res.status(200).json({
      status: "success",
      data: products,
    } as ApiResponse);
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const isUUID = /^[0-9a-f-]{36}$/.test(id);

    const product = await prisma.product.findFirst({
      where: isUUID ? { id } : { slug: id },
      include: {
        category: true,
        images: {
          orderBy: {
            order: "asc",
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Ürün bulunamadı",
      });
    }

    return res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

// Yeni ürün oluştur (sadece admin)
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      slug,
      description,

      story,
      features,
      servingSuggestion,

      price,
      stock,
      categoryId,
      images,
    } = req.body;

    if (!name || !slug || !description || !price || !categoryId) {
      return res.status(400).json({
        status: "error",
        message: "Gerekli alanlar eksik",
      } as ApiResponse);
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (existingProduct) {
      return res.status(400).json({
        status: "error",
        message: "Bu slug zaten kullanılıyor",
      } as ApiResponse);
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Kategori bulunamadı",
      } as ApiResponse);
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,

        story,
        features,
        servingSuggestion,

        price,
        stock: stock || 0,
        categoryId,

        images: images
          ? {
              create: images.map((img: any, index: number) => ({
                url: img.url,
                alt: img.alt || name,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Ürün başarıyla oluşturuldu",
      data: product,
    } as ApiResponse);
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

// Ürün güncelle (sadece admin)
export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const {
      name,
      slug,
      description,

      story,
      features,
      servingSuggestion,

      price,
      stock,
      categoryId,
      isActive,
      images,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        status: "error",
        message: "Ürün bulunamadı",
      } as ApiResponse);
    }

    if (slug && slug !== existingProduct.slug) {
      const slugInUse = await prisma.product.findUnique({
        where: {
          slug,
        },
      });

      if (slugInUse) {
        return res.status(400).json({
          status: "error",
          message: "Bu slug zaten kullanılıyor",
        } as ApiResponse);
      }
    }

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        ...(name && {
          name,
        }),

        ...(slug && {
          slug,
        }),

        ...(description && {
          description,
        }),

        ...(story !== undefined && {
          story,
        }),

        ...(features !== undefined && {
          features,
        }),

        ...(servingSuggestion !== undefined && {
          servingSuggestion,
        }),

        ...(price !== undefined && {
          price,
        }),

        ...(stock !== undefined && {
          stock,
        }),

        ...(categoryId && {
          categoryId,
        }),

        ...(isActive !== undefined && {
          isActive,
        }),

        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((img: any, index: number) => ({
              url: img.url,
              alt: img.alt || name || existingProduct.name,
              order: index,
            })),
          },
        }),
      },
      include: {
        category: true,
        images: true,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Ürün başarıyla güncellendi",
      data: product,
    } as ApiResponse);
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

// Ürün sil (sadece admin)
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Ürün bulunamadı",
      } as ApiResponse);
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Ürün başarıyla silindi",
    } as ApiResponse);
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};
