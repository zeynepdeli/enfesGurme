import { Router } from "express";
import {
  getBestsellerCards,
  getAllBestsellerCards,
  createBestsellerCard,
  updateBestsellerCard,
  deleteBestsellerCard,
} from "../controllers/bestsellerCardController"
import { authenticate } from "../middlewares/auth"
import { requireAdmin } from "../middlewares/admin";

const router = Router();

router.get("/", getBestsellerCards);
router.get("/all", authenticate, requireAdmin, getAllBestsellerCards);
router.post("/", authenticate, requireAdmin, createBestsellerCard);
router.put("/:id", authenticate, requireAdmin, updateBestsellerCard);
router.delete("/:id", authenticate, requireAdmin, deleteBestsellerCard);

export default router;