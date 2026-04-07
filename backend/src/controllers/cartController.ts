import { Response } from "express";
import { AuthRequest, ApiResponse } from "../types";
import prisma from "../config/prisma";

// Kullanıcının sepetini getir
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { order: "asc" },
                },
                category: {
                  select: {
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
                    orderBy: { order: "asc" },
                  },
                  category: {
                    select: {
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    return res.status(200).json({
      status: "success",
      data: {
        ...cart,
        total,
      },
    } as ApiResponse);
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

// Sepete ürün ekle
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        status: "error",
        message: "Ürün ID gerekli",
      } as ApiResponse);
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Ürün bulunamadı",
      } as ApiResponse);
    }

    if (!product.isActive) {
      return res.status(400).json({
        status: "error",
        message: "Bu ürün aktif değil",
      } as ApiResponse);
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        status: "error",
        message: `Stokta sadece ${product.stock} adet var`,
      } as ApiResponse);
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    let cartItem;

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({
          status: "error",
          message: `Stokta sadece ${product.stock} adet var`,
        } as ApiResponse);
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              images: {
                take: 1,
                orderBy: { order: "asc" },
              },
            },
          },
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: {
          product: {
            include: {
              images: {
                take: 1,
                orderBy: { order: "asc" },
              },
            },
          },
        },
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Ürün sepete eklendi",
      data: cartItem,
    } as ApiResponse);
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

// Sepetteki ürün miktarını güncelle
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        status: "error",
        message: "Geçerli bir miktar giriniz",
      } as ApiResponse);
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        status: "error",
        message: "Sepet öğesi bulunamadı",
      } as ApiResponse);
    }

    if (cartItem.cart.userId !== userId) {
      return res.status(403).json({
        status: "error",
        message: "Bu işlem için yetkiniz yok",
      } as ApiResponse);
    }

    if (cartItem.product.stock < quantity) {
      return res.status(400).json({
        status: "error",
        message: `Stokta sadece ${cartItem.product.stock} adet var`,
      } as ApiResponse);
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: {
          include: {
            images: {
              take: 1,
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Miktar güncellendi",
      data: updated,
    } as ApiResponse);
  } catch (error) {
    console.error("Update cart item error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

// Sepetten ürün sil
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({
        status: "error",
        message: "Sepet öğesi bulunamadı",
      } as ApiResponse);
    }

    if (cartItem.cart.userId !== userId) {
      return res.status(403).json({
        status: "error",
        message: "Bu işlem için yetkiniz yok",
      } as ApiResponse);
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "success",
      message: "Ürün sepetten çıkarıldı",
    } as ApiResponse);
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

// Sepeti temizle
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Sepet bulunamadı",
      } as ApiResponse);
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return res.status(200).json({
      status: "success",
      message: "Sepet temizlendi",
    } as ApiResponse);
  } catch (error) {
    console.error("Clear cart error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};
