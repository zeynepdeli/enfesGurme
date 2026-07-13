import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../types";

export const getPublicContactPage = async (_req: Request, res: Response) => {
  try {
    const contactPage = await prisma.contactPage.findUnique({
      where: { id: 1 },
      include: {
        socials: {
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
      data: contactPage,
    });
  } catch (error) {
    console.error("Get public contact page error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const getAdminContactPage = async (_req: AuthRequest, res: Response) => {
  try {
    const contactPage = await prisma.contactPage.findUnique({
      where: { id: 1 },
      include: {
        socials: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      data: contactPage,
    });
  } catch (error) {
    console.error("Get admin contact page error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateContactPage = async (req: AuthRequest, res: Response) => {
  try {
    const { socials, ...contactData } = req.body;

    const contactPage = await prisma.contactPage.upsert({
      where: { id: 1 },
      update: contactData,
      create: {
        id: 1,
        ...contactData,
      },
    });

    return res.status(200).json({
      status: "success",
      data: contactPage,
    });
  } catch (error) {
    console.error("Update contact page error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const createSocial = async (req: AuthRequest, res: Response) => {
  try {
    const contactPage = await prisma.contactPage.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
      },
    });

    const social = await prisma.contactSocial.create({
      data: {
        ...req.body,
        contactPageId: contactPage.id,
      },
    });

    return res.status(201).json({
      status: "success",
      data: social,
    });
  } catch (error) {
    console.error("Create social error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateSocial = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    const social = await prisma.contactSocial.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json({
      status: "success",
      data: social,
    });
  } catch (error) {
    console.error("Update social error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const deleteSocial = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    await prisma.contactSocial.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "success",
      message: "Sosyal medya kaydı silindi",
    });
  } catch (error) {
    console.error("Delete social error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};
