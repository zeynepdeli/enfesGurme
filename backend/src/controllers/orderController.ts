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
  console.log("req.body:", JSON.stringify(req.body, null, 2)); // ← ekle
  try {
    const userId = req.user!.id;
    const {
      addressId,
      items,
    }: {
      addressId: string;
      items: Array<{ productId: string; quantity: number }>;
    } = req.body;

    if (!addressId || !items?.length) {
      return res.status(400).json({
        status: "error",
        message: !addressId ? "Adres seçimi gerekli" : "Sepetiniz boş",
      });
    }

    const [address, products] = await Promise.all([
      prisma.address.findUnique({ where: { id: addressId } }),
      prisma.product.findMany({
        where: { id: { in: items.map((i) => i.productId) } },
      }),
    ]);

    if (!address || address.userId !== userId) {
      return res
        .status(404)
        .json({ status: "error", message: "Adres bulunamadı" });
    }

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product)
        return res
          .status(404)
          .json({ status: "error", message: "Ürün bulunamadı" });
      if (product.stock < item.quantity)
        return res.status(400).json({
          status: "error",
          message: `${product.name} için stok yetersiz`,
        });
    }

    const total = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + Number(product.price) * item.quantity;
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          addressId,
          total,
          status: "PENDING",
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: products.find((p) => p.id === item.productId)!.price,
            })),
          },
        },
        include: { items: { include: { product: true } }, address: true },
      });

      await Promise.all(
        items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      return newOrder;
    });

    return res.status(201).json({
      status: "success",
      message: "Sipariş başarıyla oluşturuldu",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
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
