import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController";
import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = Router();

// GET /api/dashboard
router.get("/", authenticate, requireAdmin, getDashboardStats);

export default router;
