import express from "express";
import {
  getPublicHeader,
  getAdminHeader,
  updateHeader,
  createHeaderNavLink,
  updateHeaderNavLink,
  deleteHeaderNavLink,
} from "../controllers/siteHeaderController"

import { authenticate } from "../middlewares/auth"
import { requireAdmin } from "../middlewares/admin"

const router = express.Router();

router.get("/", getPublicHeader);

router.get("/admin", authenticate, requireAdmin, getAdminHeader);
router.put("/admin", authenticate, requireAdmin, updateHeader);

router.post("/admin/nav-links", authenticate, requireAdmin, createHeaderNavLink);
router.put("/admin/nav-links/:id", authenticate, requireAdmin, updateHeaderNavLink);
router.delete("/admin/nav-links/:id", authenticate, requireAdmin, deleteHeaderNavLink);

export default router;