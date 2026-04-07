import express from "express";
import {
  register,
  login,
  logout,
  refresh,
} from "../controllers/authController";

const router = express.Router();

//Yeni kullanıcı kaydı
router.post("/register", register);

//Kullanıcı girişi
router.post("/login", login);

//Kullanıcı çıkışı
router.post("/logout", logout);

//Access token yenileme
router.post("/refresh", refresh);

export default router;
