import express from "express";
import {
  getPublicContactPage,
  getAdminContactPage,
  updateContactPage,
  createSocial,
  updateSocial,
  deleteSocial,
} from "../controllers/contactPageController";

import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = express.Router();

router.get("/", getPublicContactPage);

router.get("/admin", authenticate, requireAdmin, getAdminContactPage);
router.put("/admin", authenticate, requireAdmin, updateContactPage);

router.post("/admin/socials", authenticate, requireAdmin, createSocial);
router.put("/admin/socials/:id", authenticate, requireAdmin, updateSocial);
router.delete("/admin/socials/:id", authenticate, requireAdmin, deleteSocial);

export default router;
