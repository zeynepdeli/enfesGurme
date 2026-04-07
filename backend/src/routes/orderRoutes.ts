import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/orderController";
import { authenticate } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/admin";

const router = express.Router();

//Kullanıcı route'ları
router.get("/", authenticate, getOrders);
router.get("/:id", authenticate, getOrderById);
router.post("/", authenticate, createOrder);

//Admin route'ları
router.get("/admin/all", authenticate, requireAdmin, getAllOrders);
router.put("/:id/status", authenticate, requireAdmin, updateOrderStatus);

export default router;
