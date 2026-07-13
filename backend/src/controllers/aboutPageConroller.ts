import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../types";

export const getPublicAboutPage = async (_req: Request, res: Response) => {
  try {
    const aboutPage = await prisma.aboutPage.findUnique({
      where: { id: 1 },
    });

    return res.status(200).json({
      status: "success",
      data: aboutPage,
    });
  } catch (error) {
    console.error("Get public about page error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const getAdminAboutPage = async (_req: AuthRequest, res: Response) => {
  try {
    const aboutPage = await prisma.aboutPage.findUnique({
      where: { id: 1 },
    });

    return res.status(200).json({
      status: "success",
      data: aboutPage,
    });
  } catch (error) {
    console.error("Get admin about page error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateAboutPage = async (req: AuthRequest, res: Response) => {
  try {
    const aboutPage = await prisma.aboutPage.upsert({
      where: { id: 1 },
      update: req.body,
      create: {
        id: 1,
        ...req.body,
      },
    });

    return res.status(200).json({
      status: "success",
      data: aboutPage,
    });
  } catch (error) {
    console.error("Update about page error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};
