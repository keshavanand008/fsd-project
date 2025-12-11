import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

router.get('/me', protect, async (req, res) => res.json(req.user));

router.put('/me', protect, async (req, res) => {
  const { name, avatar, seller } = req.body;
  const u = await User.findById(req.user._id);
  if(name) u.name = name;
  if(avatar) u.avatar = avatar;
  if(seller) u.seller = { ...u.seller?.toObject?.() || {}, ...seller };
  await u.save();
  res.json(u);
});

export default router;
