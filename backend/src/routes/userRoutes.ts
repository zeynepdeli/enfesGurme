import express from "express";
import { 
  getProfile,
  getAllUsers,
  getUserById,
  updateUserRole
} from "../controllers/userController";
import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = express.Router();

// Kullanıcı kendi profilini getir (herkes)
router.get("/profile", authenticate, getProfile);

// Admin route'ları
router.get("/admin/all", authenticate, requireAdmin, getAllUsers);
router.get("/admin/:id", authenticate, requireAdmin, getUserById);
router.put("/admin/:id/role", authenticate, requireAdmin, updateUserRole);

export default router;
