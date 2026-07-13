import express from "express";
import { initCheckoutForm, handleCallback } from "../controllers/paymentController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.post("/iyzico/init", authenticate, initCheckoutForm);
router.post("/iyzico/callback", handleCallback); // İyzico'dan gelir, auth yok

export default router;