import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

//Tüm routerlar korumalı(Giriş Yapmış Kullanıcılar)
router.get("/", authenticate, getCart);
router.post("/", authenticate, addToCart);
router.put("/items/:id", authenticate, updateCartItem);
router.delete("/items/:id", authenticate, removeFromCart);
router.delete("/", authenticate, clearCart);

export default router;
