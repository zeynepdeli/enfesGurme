import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../types";

export const getPublicProfilePageSettings = async (
  _req: Request,
  res: Response,
) => {
  try {
    const settings = await prisma.profilePageSetting.findUnique({
      where: { id: 1 },
    });

    return res.status(200).json({
      status: "success",
      data: settings,
    });
  } catch (error) {
    console.error("Get profile page settings error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const getAdminProfilePageSettings = async (
  _req: AuthRequest,
  res: Response,
) => {
  try {
    const settings = await prisma.profilePageSetting.findUnique({
      where: { id: 1 },
    });

    return res.status(200).json({
      status: "success",
      data: settings,
    });
  } catch (error) {
    console.error("Get admin profile page settings error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateProfilePageSettings = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const settings = await prisma.profilePageSetting.upsert({
      where: { id: 1 },
      update: req.body,
      create: {
        id: 1,
        ...req.body,
      },
    });

    return res.status(200).json({
      status: "success",
      data: settings,
    });
  } catch (error) {
    console.error("Update profile page settings error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};
