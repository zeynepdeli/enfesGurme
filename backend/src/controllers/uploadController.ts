import { Request, Response } from "express";
import { ApiResponse } from "../types";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Dosya bulunamadı",
      } as ApiResponse);
    }

    const file = req.file as any;

    return res.status(200).json({
      status: "success",
      data: {
        url: file.path,
        publicId: file.filename,
      },
    } as ApiResponse);
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      status: "error",
      message: "Yükleme hatası",
    } as ApiResponse);
  }
};
