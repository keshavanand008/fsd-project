import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


export const createOrder = async (req, res) => {
  try {
    const { address } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total & validate stock
    let total = 0;

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${item.product.title}`,
        });
      }

      total += item.product.price * item.quantity;
    }

    // Reduce stock
    for (const item of cart.items) {
      const p = await Product.findById(item.product._id);
      p.stock -= item.quantity;
      await p.save();
    }

    // Build order items
    const orderItems = cart.items.map((i) => ({
      product: i.product._id,
      quantity: i.quantity,
      price: i.product.price,
      title: i.product.title,
      image: i.product.images?.[0] || "",
    }));

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total,
      address,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    return res.status(201).json(order);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort("-createdAt")
      .populate("items.product", "title images");

    return res.json(orders);
  } catch (err) {
    console.error("GET MY ORDERS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getSellerOrders = async (req, res) => {
  try {
    const allOrders = await Order.find()
      .sort("-createdAt")
      .populate("items.product");

    const myOrders = allOrders.filter((order) =>
      order.items.some(
        (i) => i.product?.seller?.toString() === req.user._id.toString()
      )
    );

    return res.json(myOrders);
  } catch (err) {
    console.error("GET SELLER ORDERS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // validate incoming status
    const allowed = ["processing", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // populate product.seller so we can authorize sellers
    const order = await Order.findById(id).populate({
      path: "items.product",
      select: "seller", // only need seller for authorization
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    // authorize: admin OR a seller who owns at least one item in this order
    let canUpdate = req.user.role === "admin";
    if (!canUpdate && req.user.role === "seller") {
      canUpdate = order.items.some(
        (i) =>
          i.product &&
          i.product.seller &&
          i.product.seller.toString() === req.user._id.toString()
      );
    }
    if (!canUpdate) {
      return res.status(403).json({ message: "Not authorized to update" });
    }

    order.fulfillmentStatus = status;
    await order.save();

    return res.json({ message: "Status updated", order });
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


/* ============================================================
   GET ORDER BY ID
============================================================ */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product"
    );
    if (!order) return res.status(404).json({ message: "Not found" });

    return res.json(order);
  } catch (err) {
    console.error("GET ORDER BY ID ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
