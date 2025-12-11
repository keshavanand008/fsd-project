import { Router } from "express";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post(
  "/",
  protect,
  authorize("seller", "admin"),
  upload.array("files", 10),   // IMPORTANT
  (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const paths = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ paths });
  }
);

export default router;
