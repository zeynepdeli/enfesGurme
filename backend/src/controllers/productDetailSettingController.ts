import { Request, Response } from "express";
import { AuthRequest } from "../types";
import prisma from "../config/prisma";

/* PUBLIC */

export const getProductDetailSetting = async (req: Request, res: Response) => {
  try {
    const setting = await prisma.productDetailSetting.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });

    return res.status(200).json({
      status: "success",
      data: setting,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

/* ADMIN */

export const updateProductDetailSetting = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const setting = await prisma.productDetailSetting.upsert({
      where: { id: 1 },

      update: req.body,

      create: {
        id: 1,
        ...req.body,
      },
    });

    return res.status(200).json({
      status: "success",
      data: setting,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};
