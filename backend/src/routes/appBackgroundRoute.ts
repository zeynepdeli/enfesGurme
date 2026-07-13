import express from "express";
import {
  getAppBackgroundSetting,
  updateAppBackgroundSetting,
} from "../controllers/appBackgroundController";

import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = express.Router();

router.get("/", getAppBackgroundSetting);

router.put("/admin", authenticate, requireAdmin, updateAppBackgroundSetting);

export default router;
