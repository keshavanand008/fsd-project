import express from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  deleteProduct,
  getMyProducts
} from "../controllers/product.controller.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// seller dashboard
router.get("/mine", protect, authorize("seller", "admin"), getMyProducts);

// list products
router.get("/", listProducts);

// get single product
router.get("/:id", getProduct);

// create product
router.post(
  "/",
  protect,
  authorize("seller", "admin"),
  createProduct
);

// delete product
router.delete(
  "/:id",
  protect,
  authorize("seller", "admin"),
  deleteProduct
);

export default router;
