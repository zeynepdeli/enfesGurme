import express from "express";
import {
  getPublicAboutPage,
  getAdminAboutPage,
  updateAboutPage,
} from "../controllers/aboutPageConroller";

import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = express.Router();

router.get("/", getPublicAboutPage);
router.get("/admin", authenticate, requireAdmin, getAdminAboutPage);
router.put("/admin", authenticate, requireAdmin, updateAboutPage);

export default router;
