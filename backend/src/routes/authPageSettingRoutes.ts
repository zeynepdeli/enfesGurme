import express from "express";
import {
  getAuthPageSetting,
  updateAuthPageSetting,
} from "../controllers/authPageSettingController";

import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = express.Router();

router.get("/", getAuthPageSetting);
router.put("/admin", authenticate, requireAdmin, updateAuthPageSetting);

export default router;
