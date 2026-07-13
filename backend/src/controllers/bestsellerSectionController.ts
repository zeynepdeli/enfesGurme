import { Request, Response } from "express";
import { AuthRequest } from "../types";
import prisma from "../config/prisma";

export const getBestsellerSection = async (req: Request, res: Response) => {
  try {
    const section = await prisma.bestsellerSection.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
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

export const updateBestsellerSection = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const section = await prisma.bestsellerSection.upsert({
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
