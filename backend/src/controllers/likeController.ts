import { Response } from "express";
import { AuthRequest, ApiResponse } from "../types";
import prisma from "../config/prisma";

export const getUserLikes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const likes = await prisma.like.findMany({
      where: { userId },
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
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      status: "success",
      data: likes,
    } as ApiResponse);
  } catch (error) {
    console.error("Get likes error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

export const likeProduct = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productId } = req.body;

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

    const existing = await prisma.like.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        status: "error",
        message: "Bu ürünü zaten beğendiniz",
      } as ApiResponse);
    }

    const like = await prisma.like.create({
      data: {
        userId,
        productId,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Ürün beğenildi",
      data: like,
    } as ApiResponse);
  } catch (error) {
    console.error("Like product error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

export const unlikeProduct = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const productId = req.params.productId as string;

    const like = await prisma.like.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!like) {
      return res.status(404).json({
        status: "error",
        message: "Beğeni bulunamadı",
      } as ApiResponse);
    }

    await prisma.like.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Beğeni kaldırıldı",
    } as ApiResponse);
  } catch (error) {
    console.error("Unlike product error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};
