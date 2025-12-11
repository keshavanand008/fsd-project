import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { addReview, listReviews } from '../controllers/review.controller.js';

const router = Router();
router.get('/:productId', listReviews);
router.post('/', protect, addReview);

export default router;
