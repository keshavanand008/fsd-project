import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getWishlist, toggleWishlist } from '../controllers/wishlist.controller.js';

const router = Router();
router.get('/', protect, getWishlist);
router.post('/toggle', protect, toggleWishlist);

export default router;
