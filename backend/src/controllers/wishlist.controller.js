import Wishlist from '../models/Wishlist.js';

export const getWishlist = async (req, res) => {
  let w = await Wishlist.findOne({ user: req.user._id }).populate('items');
  if(!w) w = await Wishlist.create({ user: req.user._id, items: [] });
  res.json(w);
};

export const toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  let w = await Wishlist.findOne({ user: req.user._id });
  if(!w) w = await Wishlist.create({ user: req.user._id, items: [] });
  const idx = w.items.findIndex(p => p.toString()===productId);
  if(idx>-1) w.items.splice(idx,1);
  else w.items.push(productId);
  await w.save();
  await w.populate('items');
  res.json(w);
};
