import { Response } from "express";
import { AuthRequest, ApiResponse } from "../types";
import prisma from "../config/prisma";

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        address: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      status: "success",
      data: orders,
    } as ApiResponse);
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
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
        },
        address: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        status: "error",
        message: "Sipariş bulunamadı",
      } as ApiResponse);
    }

    if (order.userId !== userId && req.user!.role !== "ADMIN") {
      return res.status(403).json({
        status: "error",
        message: "Bu işlem için yetkiniz yok",
      } as ApiResponse);
    }

    return res.status(200).json({
      status: "success",
      data: order,
    } as ApiResponse);
  } catch (error) {
    console.error("Get order error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { addressId } = req.body;

    if (!addressId) {
      return res.status(400).json({
        status: "error",
        message: "Adres seçimi gerekli",
      } as ApiResponse);
    }

    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== userId) {
      return res.status(404).json({
        status: "error",
        message: "Adres bulunamadı",
      } as ApiResponse);
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Sepetiniz boş",
      } as ApiResponse);
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          status: "error",
          message: `${item.product.name} için stok yetersiz`,
        } as ApiResponse);
      }
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          addressId,
          total,
          status: "PENDING",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          address: true,
        },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return res.status(201).json({
      status: "success",
      message: "Sipariş başarıyla oluşturuldu",
      data: order,
    } as ApiResponse);
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Geçersiz durum",
      } as ApiResponse);
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        address: true,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Sipariş durumu güncellendi",
      data: order,
    } as ApiResponse);
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        address: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      status: "success",
      data: orders,
    } as ApiResponse);
  } catch (error) {
    console.error("Get all orders error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};
