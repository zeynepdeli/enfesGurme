import express from "express";

import {
  getReviewSection,
  getReviewSectionAdmin,
  updateReviewSection,
  createReviewCard,
  updateReviewCard,
  deleteReviewCard,
} from "../controllers/reviewSectionController";

import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = express.Router();

/* PUBLIC */

router.get("/", getReviewSection);

/* ADMIN */

router.get("/admin", authenticate, requireAdmin, getReviewSectionAdmin);

router.put("/admin", authenticate, requireAdmin, updateReviewSection);

router.post("/cards", authenticate, requireAdmin, createReviewCard);

router.put("/cards/:id", authenticate, requireAdmin, updateReviewCard);

router.delete("/cards/:id", authenticate, requireAdmin, deleteReviewCard);

export default router;
