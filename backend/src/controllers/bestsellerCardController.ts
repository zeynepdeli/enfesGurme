import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../types";

export const getBestsellerCards = async (_req: Request, res: Response) => {
  try {
    const cards = await prisma.bestsellerCard.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      take: 5,
    });
    return res.status(200).json({ status: "success", data: cards });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};


export const getAllBestsellerCards = async (_req: Request, res: Response) => {
  try {
    const cards = await prisma.bestsellerCard.findMany({
      orderBy: { order: "asc" },
    });
    return res.status(200).json({ status: "success", data: cards });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

export const createBestsellerCard = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, imageUrl, price, slug, order, isActive } =
      req.body;
    if (!title || !imageUrl) {
      return res
        .status(400)
        .json({ status: "error", message: "Başlık ve görsel zorunlu" });
    }
    const card = await prisma.bestsellerCard.create({
      data: {
        title,
        description: description ?? "",
        imageUrl,
        price: price ?? 0,
        slug: slug ?? "",
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    });
    return res.status(201).json({ status: "success", data: card });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

export const updateBestsellerCard = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, description, imageUrl, price, slug, order, isActive } =
      req.body;
    const card = await prisma.bestsellerCard.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(price !== undefined && { price }),
        ...(slug !== undefined && { slug }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });
    return res.status(200).json({ status: "success", data: card });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

export const deleteBestsellerCard = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.bestsellerCard.delete({ where: { id } });
    return res.status(200).json({ status: "success", message: "Silindi" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};
