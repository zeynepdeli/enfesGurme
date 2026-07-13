import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../types";

export const getPublicHeader = async (req: Request, res: Response) => {
  try {
    let header = await prisma.siteHeader.findUnique({
      where: { id: 1 },
      include: {
        navLinks: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!header) {
      header = await prisma.siteHeader.create({
        data: {
          id: 1,
          navLinks: {
            create: [
              { label: "Anasayfa", href: "/", order: 0 },
              { label: "Ürünlerimiz", href: "/products", order: 1 },
              { label: "Hikayemiz", href: "/about", order: 2 },
              { label: "Kampanyalar", href: "/offers", order: 3 },
              { label: "İletişim", href: "/contact", order: 4 },
            ],
          },
        },
        include: {
          navLinks: {
            where: { isActive: true },
            orderBy: { order: "asc" },
          },
        },
      });
    }

    return res.status(200).json({
      status: "success",
      data: header,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const getAdminHeader = async (req: AuthRequest, res: Response) => {
  try {
    let header = await prisma.siteHeader.findUnique({
      where: { id: 1 },
      include: {
        navLinks: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!header) {
      header = await prisma.siteHeader.create({
        data: { id: 1 },
        include: { navLinks: true },
      });
    }

    return res.status(200).json({
      status: "success",
      data: header,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateHeader = async (req: AuthRequest, res: Response) => {
  try {
    const {
      logoUrl,
      logoAlt,
      deliveryTitle,
      deliveryText,
      searchPlaceholder,
      accountText,
      loginText,
      cartText,
      isActive,
    } = req.body;

    const header = await prisma.siteHeader.upsert({
      where: { id: 1 },
      update: {
        logoUrl,
        logoAlt,
        deliveryTitle,
        deliveryText,
        searchPlaceholder,
        accountText,
        loginText,
        cartText,
        isActive,
      },
      create: {
        id: 1,
        logoUrl,
        logoAlt,
        deliveryTitle,
        deliveryText,
        searchPlaceholder,
        accountText,
        loginText,
        cartText,
        isActive,
      },
      include: {
        navLinks: {
          orderBy: { order: "asc" },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      data: header,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const createHeaderNavLink = async (req: AuthRequest, res: Response) => {
  try {
    const { label, href, order, isActive } = req.body;

    if (!label || !href) {
      return res.status(400).json({
        status: "error",
        message: "Başlık ve link zorunlu",
      });
    }

    await prisma.siteHeader.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });

    const navLink = await prisma.headerNavLink.create({
      data: {
        label,
        href,
        order: order ?? 0,
        isActive: isActive ?? true,
        headerId: 1,
      },
    });

    return res.status(201).json({
      status: "success",
      data: navLink,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateHeaderNavLink = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    const navLink = await prisma.headerNavLink.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json({
      status: "success",
      data: navLink,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const deleteHeaderNavLink = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    await prisma.headerNavLink.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "success",
      message: "Menü linki silindi",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};
