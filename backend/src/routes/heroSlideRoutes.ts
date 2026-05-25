import express from "express";
import {
  getActiveSlides,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
} from "../controllers/heroSliderController";
import { uploadImage } from "../controllers/uploadController";
import { upload } from "../config/cloudinary";
import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = express.Router();

router.get("/", getActiveSlides);
router.get("/admin/all", authenticate, requireAdmin, getAllSlides);
router.post("/", authenticate, requireAdmin, createSlide);
router.put("/:id", authenticate, requireAdmin, updateSlide);
router.delete("/:id", authenticate, requireAdmin, deleteSlide);
router.post(
  "/upload",
  authenticate,
  requireAdmin,
  upload.single("image"),
  uploadImage,
);

export default router;
