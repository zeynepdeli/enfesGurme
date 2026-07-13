import express from "express";
import {
  getHeroSetting,
  updateHeroSetting,
} from "../controllers/heroSettingController";

import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = express.Router();

router.get("/", getHeroSetting);

router.put("/admin", authenticate, requireAdmin, updateHeroSetting);

export default router;
