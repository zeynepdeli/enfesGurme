import { Request, Response } from "express";
import prisma from "../config/prisma";
import { AuthRequest } from "../types";

const getIdFromParams = (value: string | string[] | undefined) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const id = Number(raw);

  return Number.isNaN(id) ? null : id;
};

export const getPublicFooter = async (_req: Request, res: Response) => {
  try {
    const footer = await prisma.siteFooter.findUnique({
      where: { id: 1 },
      include: {
        navLinks: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        contactItems: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        socials: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
        bottomLinks: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      data: footer,
    });
  } catch (error) {
    console.error("Get public footer error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const getAdminFooter = async (_req: AuthRequest, res: Response) => {
  try {
    const footer = await prisma.siteFooter.findUnique({
      where: { id: 1 },
      include: {
        navLinks: {
          orderBy: { order: "asc" },
        },
        contactItems: {
          orderBy: { order: "asc" },
        },
        socials: {
          orderBy: { order: "asc" },
        },
        bottomLinks: {
          orderBy: { order: "asc" },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      data: footer,
    });
  } catch (error) {
    console.error("Get admin footer error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateFooter = async (req: AuthRequest, res: Response) => {
  try {
    const { navLinks, contactItems, socials, bottomLinks, ...footerData } =
      req.body;

    const footer = await prisma.siteFooter.upsert({
      where: { id: 1 },
      update: footerData,
      create: {
        id: 1,
        ...footerData,
      },
    });

    return res.status(200).json({
      status: "success",
      data: footer,
    });
  } catch (error) {
    console.error("Update footer error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

/* NAV LINKS */

export const createFooterNavLink = async (req: AuthRequest, res: Response) => {
  try {
    const footer = await prisma.siteFooter.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });

    const item = await prisma.footerNavLink.create({
      data: {
        ...req.body,
        footerId: footer.id,
      },
    });

    return res.status(201).json({
      status: "success",
      data: item,
    });
  } catch (error) {
    console.error("Create footer nav link error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateFooterNavLink = async (req: AuthRequest, res: Response) => {
  try {
    const id = getIdFromParams(req.params.id);

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Geçersiz ID",
      });
    }

    const item = await prisma.footerNavLink.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json({
      status: "success",
      data: item,
    });
  } catch (error) {
    console.error("Update footer nav link error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const deleteFooterNavLink = async (req: AuthRequest, res: Response) => {
  try {
    const id = getIdFromParams(req.params.id);

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Geçersiz ID",
      });
    }

    await prisma.footerNavLink.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "success",
      message: "Footer menü linki silindi",
    });
  } catch (error) {
    console.error("Delete footer nav link error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

/* CONTACT ITEMS */

export const createFooterContactItem = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const footer = await prisma.siteFooter.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });

    const item = await prisma.footerContactItem.create({
      data: {
        ...req.body,
        footerId: footer.id,
      },
    });

    return res.status(201).json({
      status: "success",
      data: item,
    });
  } catch (error) {
    console.error("Create footer contact item error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateFooterContactItem = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const id = getIdFromParams(req.params.id);

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Geçersiz ID",
      });
    }

    const item = await prisma.footerContactItem.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json({
      status: "success",
      data: item,
    });
  } catch (error) {
    console.error("Update footer contact item error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const deleteFooterContactItem = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const id = getIdFromParams(req.params.id);

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Geçersiz ID",
      });
    }

    await prisma.footerContactItem.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "success",
      message: "Footer iletişim bilgisi silindi",
    });
  } catch (error) {
    console.error("Delete footer contact item error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

/* SOCIALS */

export const createFooterSocial = async (req: AuthRequest, res: Response) => {
  try {
    const footer = await prisma.siteFooter.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });

    const item = await prisma.footerSocial.create({
      data: {
        ...req.body,
        footerId: footer.id,
      },
    });

    return res.status(201).json({
      status: "success",
      data: item,
    });
  } catch (error) {
    console.error("Create footer social error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateFooterSocial = async (req: AuthRequest, res: Response) => {
  try {
    const id = getIdFromParams(req.params.id);

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Geçersiz ID",
      });
    }

    const item = await prisma.footerSocial.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json({
      status: "success",
      data: item,
    });
  } catch (error) {
    console.error("Update footer social error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const deleteFooterSocial = async (req: AuthRequest, res: Response) => {
  try {
    const id = getIdFromParams(req.params.id);

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Geçersiz ID",
      });
    }

    await prisma.footerSocial.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "success",
      message: "Footer sosyal medya linki silindi",
    });
  } catch (error) {
    console.error("Delete footer social error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

/* BOTTOM LINKS */

export const createFooterBottomLink = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const footer = await prisma.siteFooter.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1 },
    });

    const item = await prisma.footerBottomLink.create({
      data: {
        ...req.body,
        footerId: footer.id,
      },
    });

    return res.status(201).json({
      status: "success",
      data: item,
    });
  } catch (error) {
    console.error("Create footer bottom link error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const updateFooterBottomLink = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const id = getIdFromParams(req.params.id);

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Geçersiz ID",
      });
    }

    const item = await prisma.footerBottomLink.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json({
      status: "success",
      data: item,
    });
  } catch (error) {
    console.error("Update footer bottom link error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};

export const deleteFooterBottomLink = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const id = getIdFromParams(req.params.id);

    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Geçersiz ID",
      });
    }

    await prisma.footerBottomLink.delete({
      where: { id },
    });

    return res.status(200).json({
      status: "success",
      message: "Footer alt linki silindi",
    });
  } catch (error) {
    console.error("Delete footer bottom link error:", error);

    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası",
    });
  }
};
