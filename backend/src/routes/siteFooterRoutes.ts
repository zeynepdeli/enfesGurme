import express from "express";
import {
  getPublicFooter,
  getAdminFooter,
  updateFooter,
  createFooterNavLink,
  updateFooterNavLink,
  deleteFooterNavLink,
  createFooterContactItem,
  updateFooterContactItem,
  deleteFooterContactItem,
  createFooterSocial,
  updateFooterSocial,
  deleteFooterSocial,
  createFooterBottomLink,
  updateFooterBottomLink,
  deleteFooterBottomLink,
} from "../controllers/siteFooterController";

import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = express.Router();

router.get("/", getPublicFooter);

router.get("/admin", authenticate, requireAdmin, getAdminFooter);
router.put("/admin", authenticate, requireAdmin, updateFooter);

/* NAV LINKS */
router.post(
  "/admin/nav-links",
  authenticate,
  requireAdmin,
  createFooterNavLink,
);
router.put(
  "/admin/nav-links/:id",
  authenticate,
  requireAdmin,
  updateFooterNavLink,
);
router.delete(
  "/admin/nav-links/:id",
  authenticate,
  requireAdmin,
  deleteFooterNavLink,
);

/* CONTACT ITEMS */
router.post(
  "/admin/contact-items",
  authenticate,
  requireAdmin,
  createFooterContactItem,
);
router.put(
  "/admin/contact-items/:id",
  authenticate,
  requireAdmin,
  updateFooterContactItem,
);
router.delete(
  "/admin/contact-items/:id",
  authenticate,
  requireAdmin,
  deleteFooterContactItem,
);

/* SOCIALS */
router.post("/admin/socials", authenticate, requireAdmin, createFooterSocial);
router.put(
  "/admin/socials/:id",
  authenticate,
  requireAdmin,
  updateFooterSocial,
);
router.delete(
  "/admin/socials/:id",
  authenticate,
  requireAdmin,
  deleteFooterSocial,
);

/* BOTTOM LINKS */
router.post(
  "/admin/bottom-links",
  authenticate,
  requireAdmin,
  createFooterBottomLink,
);
router.put(
  "/admin/bottom-links/:id",
  authenticate,
  requireAdmin,
  updateFooterBottomLink,
);
router.delete(
  "/admin/bottom-links/:id",
  authenticate,
  requireAdmin,
  deleteFooterBottomLink,
);

export default router;
