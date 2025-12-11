import express from "express";
import {
  createOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus
} from "../controllers/order.controller.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

//  Buyer: create order
router.post("/", protect, createOrder);

//  Buyer: my orders
router.get("/my", protect, getMyOrders);

//  Seller: orders for seller's products
router.get("/seller", protect, authorize("seller", "admin"), getSellerOrders);

//  Seller/Admin: update fulfilment status
router.patch(
  "/:id/status",
  protect,
  authorize("seller", "admin"),
  updateOrderStatus
);

export default router;
