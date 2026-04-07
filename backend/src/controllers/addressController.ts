import { Response } from "express";
import { AuthRequest, ApiResponse } from "../types";
import prisma from "../config/prisma";

export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return res.status(200).json({
      status: "success",
      data: addresses,
    } as ApiResponse);
  } catch (error) {
    console.error("Get addresses error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

export const createAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      title,
      fullName,
      phone,
      city,
      district,
      address,
      zipCode,
      isDefault,
    } = req.body;

    if (!title || !fullName || !phone || !city || !district || !address) {
      return res.status(400).json({
        status: "error",
        message: "Gerekli alanlar eksik",
      } as ApiResponse);
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        title,
        fullName,
        phone,
        city,
        district,
        address,
        zipCode,
        isDefault: isDefault || false,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Adres eklendi",
      data: newAddress,
    } as ApiResponse);
  } catch (error) {
    console.error("Create address error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

export const updateAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;
    const {
      title,
      fullName,
      phone,
      city,
      district,
      address,
      zipCode,
      isDefault,
    } = req.body;

    const existing = await prisma.address.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        status: "error",
        message: "Adres bulunamadı",
      } as ApiResponse);
    }

    if (existing.userId !== userId) {
      return res.status(403).json({
        status: "error",
        message: "Bu işlem için yetkiniz yok",
      } as ApiResponse);
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(fullName && { fullName }),
        ...(phone && { phone }),
        ...(city && { city }),
        ...(district && { district }),
        ...(address && { address }),
        ...(zipCode !== undefined && { zipCode }),
        ...(isDefault !== undefined && { isDefault }),
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Adres güncellendi",
      data: updated,
    } as ApiResponse);
  } catch (error) {
    console.error("Update address error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      return res.status(404).json({
        status: "error",
        message: "Adres bulunamadı",
      } as ApiResponse);
    }

    if (address.userId !== userId) {
      return res.status(403).json({
        status: "error",
        message: "Bu işlem için yetkiniz yok",
      } as ApiResponse);
    }

    await prisma.address.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "success",
      message: "Adres silindi",
    } as ApiResponse);
  } catch (error) {
    console.error("Delete address error:", error);
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    } as ApiResponse);
  }
};
