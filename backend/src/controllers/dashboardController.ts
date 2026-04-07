import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Toplam ürün sayısı
    const totalProducts = await prisma.product.count();

    // Toplam kategori sayısı
    const totalCategories = await prisma.category.count();

    // Toplam sipariş sayısı
    const totalOrders = await prisma.order.count();

    // Toplam gelir - Decimal'i number'a çevir
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ["CONFIRMED", "SHIPPED", "DELIVERED"],
        },
      },
      select: {
        total: true,
      },
    });
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + order.total.toNumber(); // ✅ Decimal → number
    }, 0);

    // Düşük stoklu ürünler (stok < 10)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lt: 10,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        stock: "asc",
      },
      take: 5,
    });

    // Son eklenen ürünler
    const recentProducts = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // Son siparişler
    const recentOrders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    res.json({
      status: "success",
      data: {
        stats: {
          totalProducts,
          totalCategories,
          totalOrders,
          totalRevenue,
        },
        lowStockProducts,
        recentProducts,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      status: "error",
      message: "Dashboard istatistikleri alınamadı",
    });
  }
};
