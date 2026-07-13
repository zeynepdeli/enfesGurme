import { Router } from "express";
import {
  createFaqCategory,
  createFaqItem,
  deleteFaqCategory,
  deleteFaqItem,
  getAdminFaqPage,
  getPublicFaqPage,
  updateFaqCategory,
  updateFaqItem,
  updateFaqSettings,
} from "../controllers/faqController";
import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = Router();

router.get("/", getPublicFaqPage);

router.get("/admin", authenticate, requireAdmin, getAdminFaqPage);
router.put("/admin/settings", authenticate, requireAdmin, updateFaqSettings);

router.post("/admin/categories", authenticate, requireAdmin, createFaqCategory);
router.put(
  "/admin/categories/:id",
  authenticate,
  requireAdmin,
  updateFaqCategory,
);
router.delete(
  "/admin/categories/:id",
  authenticate,
  requireAdmin,
  deleteFaqCategory,
);

router.post("/admin/items", authenticate, requireAdmin, createFaqItem);
router.put("/admin/items/:id", authenticate, requireAdmin, updateFaqItem);
router.delete("/admin/items/:id", authenticate, requireAdmin, deleteFaqItem);

export default router;
