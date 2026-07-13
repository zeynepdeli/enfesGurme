import express from "express";

import {
  getFeatureSection,
  getFeatureSectionAdmin,
  updateFeatureSection,
  createFeatureItem,
  updateFeatureItem,
  deleteFeatureItem,
} from "../controllers/featureSectionContoller"

import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = express.Router();

router.get("/", getFeatureSection);

router.get("/admin", authenticate, requireAdmin, getFeatureSectionAdmin);

router.put("/admin", authenticate, requireAdmin, updateFeatureSection);

router.post("/items", authenticate, requireAdmin, createFeatureItem);

router.put("/items/:id", authenticate, requireAdmin, updateFeatureItem);

router.delete("/items/:id", authenticate, requireAdmin, deleteFeatureItem);

export default router;
