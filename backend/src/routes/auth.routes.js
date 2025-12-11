import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  
} from "../controllers/auth.controller.js";

const router = Router();


router.post(
  "/register",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .isEmail()
      .withMessage("Enter a valid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    body("role")
      .optional()
      .isIn(["buyer", "seller", "admin"])
      .withMessage("Invalid role selected"),
  ],
  register
);

/* LOGIN ROUTE */
router.post("/login", login);




export default router;
