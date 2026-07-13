import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../types";

export const getPublicSeo = async (req: Request, res: Response) => {
  try {
    let seo = await prisma.siteSeo.findUnique({
      where: { id: 1 },
    });

    if (!seo) {
      seo = await prisma.siteSeo.create({
        data: { id: 1 },
      });
    }

    return res.status(200).json({
      status: "success",
      data: seo,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const getAdminSeo = async (req: AuthRequest, res: Response) => {
  try {
    let seo = await prisma.siteSeo.findUnique({
      where: { id: 1 },
    });

    if (!seo) {
      seo = await prisma.siteSeo.create({
        data: { id: 1 },
      });
    }

    return res.status(200).json({
      status: "success",
      data: seo,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateSeo = async (req: AuthRequest, res: Response) => {
  try {
    const seo = await prisma.siteSeo.upsert({
      where: { id: 1 },
      update: req.body,
      create: {
        id: 1,
        ...req.body,
      },
    });

    return res.status(200).json({
      status: "success",
      data: seo,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};
