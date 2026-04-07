import { Response } from "express";
import { AuthRequest, ApiResponse } from "../types";
import prisma from "../config/prisma";

export const getProductReviews = async (req: AuthRequest, res: Response) => {
  try {
    const productId = req.params.productId as string;

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return res.status(200).json({
      status: "success",
      data: {
        reviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length,
      },
    } as ApiResponse);
  } catch (error) {
    console.error("Get reviews error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        status: "error",
        message: "Tüm alanlar gerekli",
      } as ApiResponse);
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: "error",
        message: "Puan 1-5 arasında olmalı",
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

    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingReview) {
      return res.status(400).json({
        status: "error",
        message: "Bu ürün için zaten yorum yaptınız",
      } as ApiResponse);
    }

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Yorum başarıyla eklendi",
      data: review,
    } as ApiResponse);
  } catch (error) {
    console.error("Create review error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const { rating, comment } = req.body;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return res.status(404).json({
        status: "error",
        message: "Yorum bulunamadı",
      } as ApiResponse);
    }

    if (review.userId !== userId) {
      return res.status(403).json({
        status: "error",
        message: "Bu işlem için yetkiniz yok",
      } as ApiResponse);
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        status: "error",
        message: "Puan 1-5 arasında olmalı",
      } as ApiResponse);
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        ...(rating && { rating }),
        ...(comment && { comment }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Yorum güncellendi",
      data: updated,
    } as ApiResponse);
  } catch (error) {
    console.error("Update review error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const id = req.params.id as string;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return res.status(404).json({
        status: "error",
        message: "Yorum bulunamadı",
      } as ApiResponse);
    }

    if (review.userId !== userId && userRole !== "ADMIN") {
      return res.status(403).json({
        status: "error",
        message: "Bu işlem için yetkiniz yok",
      } as ApiResponse);
    }

    await prisma.review.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "success",
      message: "Yorum silindi",
    } as ApiResponse);
  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};
