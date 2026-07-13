import { Request, Response } from "express";
import { AuthRequest } from "../types";
import prisma from "../config/prisma";

export const getFeatureSection = async (req: Request, res: Response) => {
  try {
    const section = await prisma.featureSection.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
      },
      include: {
        items: {
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

export const getFeatureSectionAdmin = async (req: Request, res: Response) => {
  try {
    const section = await prisma.featureSection.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
      },
      include: {
        items: {
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

export const updateFeatureSection = async (req: AuthRequest, res: Response) => {
  try {
    const section = await prisma.featureSection.upsert({
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

export const createFeatureItem = async (req: AuthRequest, res: Response) => {
  try {
    const { title, icon, order } = req.body;

    const item = await prisma.featureItem.create({
      data: {
        title,
        icon,
        order: order ?? 0,
        sectionId: 1,
      },
    });

    return res.status(201).json({
      status: "success",
      data: item,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateFeatureItem = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    const item = await prisma.featureItem.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json({
      status: "success",
      data: item,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const deleteFeatureItem = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    await prisma.featureItem.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "success",
      message: "Özellik silindi",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};
