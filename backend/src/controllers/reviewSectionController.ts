import { Request, Response } from "express";
import { AuthRequest } from "../types";
import prisma from "../config/prisma";

export const getReviewSection = async (req: Request, res: Response) => {
  try {
    const section = await prisma.reviewSection.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
      },
      include: {
        cards: {
          where: {
            isActive: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      data: section,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const getReviewSectionAdmin = async (req: Request, res: Response) => {
  try {
    const section = await prisma.reviewSection.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
      },
      include: {
        cards: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      data: section,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateReviewSection = async (req: AuthRequest, res: Response) => {
  try {
    const section = await prisma.reviewSection.upsert({
      where: { id: 1 },

      update: req.body,

      create: {
        id: 1,
        ...req.body,
      },
    });

    return res.status(200).json({
      status: "success",
      data: section,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const createReviewCard = async (req: AuthRequest, res: Response) => {
  try {
    const { name, rating, comment, userImage, productImage, order, isActive } =
      req.body;

    const card = await prisma.homeReviewCard.create({
      data: {
        name,
        rating: rating ?? 5,
        comment,
        userImage,
        productImage,
        order: order ?? 0,
        isActive: isActive ?? true,
        sectionId: 1,
      },
    });

    return res.status(201).json({
      status: "success",
      data: card,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateReviewCard = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    const card = await prisma.homeReviewCard.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json({
      status: "success",
      data: card,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const deleteReviewCard = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    await prisma.homeReviewCard.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "success",
      message: "Yorum kartı silindi",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};
