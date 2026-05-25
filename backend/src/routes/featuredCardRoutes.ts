import { Router } from "express";
import {
  getFeaturedCards,
  getAllFeaturedCards,
  createFeaturedCard,
  updateFeaturedCard,
  deleteFeaturedCard,
} from "../controllers/featuredCardController";
import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = Router();

router.get("/", getFeaturedCards); // public
router.get("/all", authenticate, requireAdmin, getAllFeaturedCards); // admin
router.post("/", authenticate, requireAdmin, createFeaturedCard);
router.put("/:id", authenticate, requireAdmin, updateFeaturedCard);
router.delete("/:id", authenticate, requireAdmin, deleteFeaturedCard);

export default router;
