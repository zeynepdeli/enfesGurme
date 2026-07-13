import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../types";

export const getPublicFaqPage = async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.faqPageSetting.findUnique({
      where: { id: 1 },
    });

    const categories = await prisma.faqCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    const items = await prisma.faqItem.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { order: "asc" },
    });

    return res.status(200).json({
      status: "success",
      data: { settings, categories, items },
    });
  } catch (error) {
    console.error("Get public faq page error:", error);
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

export const getAdminFaqPage = async (_req: AuthRequest, res: Response) => {
  try {
    const settings = await prisma.faqPageSetting.findUnique({
      where: { id: 1 },
    });

    const categories = await prisma.faqCategory.findMany({
      orderBy: { order: "asc" },
    });

    const items = await prisma.faqItem.findMany({
      include: { category: true },
      orderBy: { order: "asc" },
    });

    return res.status(200).json({
      status: "success",
      data: { settings, categories, items },
    });
  } catch (error) {
    console.error("Get admin faq page error:", error);
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

export const updateFaqSettings = async (req: AuthRequest, res: Response) => {
  try {
    const settings = await prisma.faqPageSetting.upsert({
      where: { id: 1 },
      update: req.body,
      create: { id: 1, ...req.body },
    });

    return res.status(200).json({ status: "success", data: settings });
  } catch (error) {
    console.error("Update faq settings error:", error);
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

export const createFaqCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await prisma.faqCategory.create({
      data: req.body,
    });

    return res.status(201).json({ status: "success", data: category });
  } catch (error) {
    console.error("Create faq category error:", error);
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

export const updateFaqCategory = async (req: AuthRequest, res: Response) => {
  try {
    const category = await prisma.faqCategory.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });

    return res.status(200).json({ status: "success", data: category });
  } catch (error) {
    console.error("Update faq category error:", error);
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

export const deleteFaqCategory = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.faqCategory.delete({
      where: { id: Number(req.params.id) },
    });

    return res
      .status(200)
      .json({ status: "success", message: "Kategori silindi" });
  } catch (error) {
    console.error("Delete faq category error:", error);
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

export const createFaqItem = async (req: AuthRequest, res: Response) => {
  try {
    const item = await prisma.faqItem.create({
      data: {
        ...req.body,
        categoryId: req.body.categoryId ? Number(req.body.categoryId) : null,
      },
    });

    return res.status(201).json({ status: "success", data: item });
  } catch (error) {
    console.error("Create faq item error:", error);
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

export const updateFaqItem = async (req: AuthRequest, res: Response) => {
  try {
    const item = await prisma.faqItem.update({
      where: { id: Number(req.params.id) },
      data: {
        ...req.body,
        categoryId: req.body.categoryId ? Number(req.body.categoryId) : null,
      },
    });

    return res.status(200).json({ status: "success", data: item });
  } catch (error) {
    console.error("Update faq item error:", error);
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

export const deleteFaqItem = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.faqItem.delete({
      where: { id: Number(req.params.id) },
    });

    return res.status(200).json({ status: "success", message: "SSS silindi" });
  } catch (error) {
    console.error("Delete faq item error:", error);
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};
