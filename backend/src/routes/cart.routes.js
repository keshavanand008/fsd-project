import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
} from "../controllers/cart.controller.js";

const router = Router();

// Get cart
router.get("/", protect, getCart);

// Add to cart
router.post("/", protect, addToCart);

// Update quantity
router.patch("/item/:itemId", protect, updateQuantity);

// Remove item
router.delete("/item/:itemId", protect, removeItem);

// Clear cart
router.delete("/", protect, clearCart);

export default router;
