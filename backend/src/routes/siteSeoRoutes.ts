import express from "express";
import {
  getPublicSeo,
  getAdminSeo,
  updateSeo,
} from "../controllers/siteSeoController";

import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = express.Router();

router.get("/", getPublicSeo);
router.get("/admin", authenticate, requireAdmin, getAdminSeo);
router.put("/admin", authenticate, requireAdmin, updateSeo);

export default router;
