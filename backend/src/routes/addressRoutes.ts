import express from "express";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.get("/", authenticate, getAddresses);
router.post("/", authenticate, createAddress);
router.put("/:id", authenticate, updateAddress);
router.delete("/:id", authenticate, deleteAddress);

export default router;
