import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest, ApiResponse } from "../types";

// GET /api/featured-cards — public
export const getFeaturedCards = async (_req: Request, res: Response) => {
  try {
    const cards = await prisma.featuredCard.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 4,
    });
    return res.status(200).json({ status: "success", data: cards });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

// GET /api/featured-cards/all — admin (pasifler dahil)
export const getAllFeaturedCards = async (_req: Request, res: Response) => {
  try {
    const cards = await prisma.featuredCard.findMany({
      orderBy: { order: "asc" },
    });
    return res.status(200).json({ status: "success", data: cards });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

// POST /api/featured-cards — admin
export const createFeaturedCard = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, imageUrl, order, isActive } = req.body;
    if (!title || !imageUrl) {
      return res
        .status(400)
        .json({ status: "error", message: "Başlık ve görsel zorunlu" });
    }
    const card = await prisma.featuredCard.create({
      data: {
        title,
        description: description ?? "",
        imageUrl,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });
    return res.status(201).json({ status: "success", data: card });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

// PATCH /api/featured-cards/:id — admin
export const updateFeaturedCard = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, description, imageUrl, order, isActive } = req.body;
    const card = await prisma.featuredCard.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    return res.status(200).json({ status: "success", data: card });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

// DELETE /api/featured-cards/:id — admin
export const deleteFeaturedCard = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.featuredCard.delete({ where: { id } });
    return res.status(200).json({ status: "success", message: "Silindi" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};
