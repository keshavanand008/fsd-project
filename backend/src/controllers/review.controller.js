import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const exists = await Review.findOne({ product: productId, user: req.user._id });
  if(exists) return res.status(400).json({ message: 'Already reviewed' });
  const r = await Review.create({ product: productId, user: req.user._id, rating, comment });
  // Update product rating
  const agg = await Review.aggregate([
    { $match: { product: r.product } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const { avg=0, count=0 } = agg[0] || {};
  await Product.findByIdAndUpdate(productId, { rating: avg, numReviews: count });
  res.status(201).json(r);
};

export const listReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
  res.json(reviews);
};
