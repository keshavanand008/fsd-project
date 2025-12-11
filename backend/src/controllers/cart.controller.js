import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get cart
export const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  res.json({ items: cart.items });
};

//  Add to cart
export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  if (product.stock < quantity)
    return res.status(400).json({ message: `Only ${product.stock} left in stock` });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existing = cart.items.find(i => i.product.toString() === productId);

  if (existing) {
    if (existing.quantity + quantity > product.stock)
      return res.status(400).json({ message: `Only ${product.stock} left in stock` });

    existing.quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity) });
  }

  await cart.save();
  await cart.populate("items.product");

  res.json({ items: cart.items });
};

// Update quantity
export const updateQuantity = async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params; 

  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart) return res.json({ items: [] });

  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });

  if (quantity < 1)
    return res.status(400).json({ message: "Quantity must be at least 1" });

  if (quantity > item.product.stock)
    return res.status(400).json({ message: `Only ${item.product.stock} left in stock` });

  item.quantity = quantity;

  await cart.save();
  await cart.populate("items.product");

  res.json({ items: cart.items }); //  FIXED
};

// Remove item
export const removeItem = async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.id(itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });

  item.deleteOne();
  await cart.save();
  await cart.populate("items.product");

  res.json({ items: cart.items });
};

//  Clear cart
export const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ items: [] });

  cart.items = [];
  await cart.save();

  res.json({ items: [] });
};
