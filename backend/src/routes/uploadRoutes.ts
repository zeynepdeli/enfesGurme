import { Router } from "express";
import { uploadImage } from "../controllers/uploadController";
import { upload } from "../config/cloudinary";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/", authenticate, upload.single("image"), uploadImage);

export default router;
