import express from "express";
import {
  getUserLikes,
  likeProduct,
  unlikeProduct,
} from "../controllers/likeController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.get("/", authenticate, getUserLikes);
router.post("/", authenticate, likeProduct);
router.delete("/:productId", authenticate, unlikeProduct);

export default router;
