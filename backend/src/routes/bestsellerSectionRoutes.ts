import express from "express";

import {
  getBestsellerSection,
  updateBestsellerSection,
} from "../controllers/bestsellerSectionController";

import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = express.Router();

router.get("/", getBestsellerSection);

router.put(
  "/admin",
  authenticate,
  requireAdmin,
  updateBestsellerSection,
);

export default router;