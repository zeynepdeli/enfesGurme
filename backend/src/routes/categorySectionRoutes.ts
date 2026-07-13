import express from "express";

import {
  getCategorySection,
  updateCategorySection,
} from "../controllers/categorySectionController";

import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = express.Router();

router.get("/", getCategorySection);

router.put("/admin", authenticate, requireAdmin, updateCategorySection);

export default router;
