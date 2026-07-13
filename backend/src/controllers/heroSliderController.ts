import { Request, Response } from "express";
import { AuthRequest, ApiResponse } from "../types";
import prisma from "../config/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Public - aktif slide'ları getir
export const getActiveSlides = async (req: Request, res: Response) => {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return res.status(200).json({ status: "success", data: slides });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

// Admin - tüm slide'ları getir
export const getAllSlides = async (req: Request, res: Response) => {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { order: "asc" },
    });
    return res.status(200).json({ status: "success", data: slides });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

// Admin - yeni slide oluştur
export const createSlide = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      subtitle,
      description,
      buttonText,
      buttonLink,
      imageUrl,
      order,
    } = req.body;

    if (!title || !imageUrl) {
      return res
        .status(400)
        .json({ status: "error", message: "Başlık ve görsel zorunlu" });
    }

    const slide = await prisma.heroSlide.create({
      data: {
        title,
        subtitle,
        description,
        buttonText,
        buttonLink,
        imageUrl,
        order: order ?? 0,
      },
    });

    return res.status(201).json({ status: "success", data: slide });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

// Admin - slide güncelle
export const updateSlide = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const data = req.body;

    const slide = await prisma.heroSlide.update({
      where: { id },
      data,
    });

    return res.status(200).json({ status: "success", data: slide });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

// Admin - slide sil
export const deleteSlide = async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    await prisma.heroSlide.delete({ where: { id } });
    return res
      .status(200)
      .json({ status: "success", message: "Slide silindi" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Sunucu hatası" });
  }
};

// Admin - görsel yükle
export const uploadImage = async (req: AuthRequest, res: Response) => {
  try {
    const { base64, fileName } = req.body;

    if (!base64) {
      return res
        .status(400)
        .json({ status: "error", message: "Görsel zorunlu" });
    }

    const result = await cloudinary.uploader.upload(base64, {
      folder: "hero-slides",
      public_id: fileName,
    });

    return res
      .status(200)
      .json({ status: "success", data: { url: result.secure_url } });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Yükleme hatası" });
  }
};
