import { Router } from "express";
import User from "../models/User.js";

const router = Router();

router.get("/", async (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).json({ message: "No token" });

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.emailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;

  await user.save();

  res.json({ message: "Email verified successfully" });
});

export default router;
