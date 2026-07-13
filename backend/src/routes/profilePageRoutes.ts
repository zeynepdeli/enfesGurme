import { Router } from "express";
import {
  getAdminProfilePageSettings,
  getPublicProfilePageSettings,
  updateProfilePageSettings,
} from "../controllers/profilePageController";
import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";
const router = Router();

router.get("/", getPublicProfilePageSettings);

router.get("/admin", authenticate, requireAdmin, getAdminProfilePageSettings);
router.put("/admin", authenticate, requireAdmin, updateProfilePageSettings);

export default router;
