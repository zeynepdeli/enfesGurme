import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../types";

export const getAppBackgroundSetting = async (req: Request, res: Response) => {
  try {
    const setting = await prisma.appBackgroundSetting.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });

    return res.status(200).json({
      status: "success",
      data: setting,
    });
  } catch (error) {
    console.error("App background get error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateAppBackgroundSetting = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const setting = await prisma.appBackgroundSetting.upsert({
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
    console.error("App background update error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};
