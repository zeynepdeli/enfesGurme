import express from "express";

import {
  getProductDetailSetting,
  updateProductDetailSetting,
} from "../controllers/productDetailSettingController";

import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = express.Router();

/* PUBLIC */

router.get("/", getProductDetailSetting);

/* ADMIN */

router.put("/admin", authenticate, requireAdmin, updateProductDetailSetting);

export default router;
