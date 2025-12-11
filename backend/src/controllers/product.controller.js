import Product from "../models/Product.js";

/* ============================================================
LIST PRODUCTS (supports ?seller=me)
============================================================ */
export const listProducts = async (req, res) => {
  const { q, brand, min, max, seller, sort='-createdAt', page=1, limit=12 } = req.query;

  const filter = { isActive: true };

  if (q) filter.title = { $regex: q, $options: "i" };
  if (brand) filter.brand = brand;

  if (min || max) {
    filter.price = {};
    if (min) filter.price.$gte = Number(min);
    if (max) filter.price.$lte = Number(max);
  }

  // seller filter (supports seller=me)
  if (seller) {
    if (seller === "me" && req.user) filter.seller = req.user._id;
    else if (seller !== "me") filter.seller = seller;
  }

  const skip = (page - 1) * limit;

  const [items, count] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("seller", "name role seller.shopName"),

    Product.countDocuments(filter)
  ]);

  res.json({
    items,
    count,
    page: Number(page),
    pages: Math.ceil(count / Number(limit)),
  });
};

/* ============================================================
    GET SINGLE PRODUCT
============================================================ */
export const getProduct = async (req, res) => {
  const p = await Product.findById(req.params.id).populate(
    "seller",
    "name role seller.shopName"
  );
  if (!p) return res.status(404).json({ message: "Product not found" });
  res.json(p);
};

/* ============================================================
    GET MY PRODUCTS — Used by Seller Dashboard
============================================================ */
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort("-createdAt");
    res.json(products);
  } catch (err) {
    console.error("GET MY PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
    CREATE PRODUCT — FIX FOR IMAGE ISSUE
============================================================ */
export const createProduct = async (req, res) => {
  const data = req.body;

  data.seller = req.user._id;

  let images = [];

  //  CASE 1: Frontend uploaded files using FormData -> upload route
  if (req.files?.length > 0) {
    images = req.files.map((f) => `/uploads/${f.filename}`);
  }

  
  if (!images.length && data.images) {
    if (typeof data.images === "string") {
      // frontend may send: "['/uploads/a.png','/uploads/b.png']"
      try {
        images = JSON.parse(data.images);
      } catch {
        images = [data.images];
      }
    } else {
      images = data.images;
    }
  }

  data.images = images;

  data.specs = {
    ram: data.ram,
    storage: data.storage,
    color: data.color,
    condition: data.condition || "new",
  };

  // cleanup
  delete data.ram;
  delete data.storage;
  delete data.color;
  delete data.condition;

  const product = await Product.create(data);
  res.status(201).json(product);
};


export const updateProduct = async (req, res) => {
  const p = await Product.findById(req.params.id);

  if (!p) return res.status(404).json({ message: "Product not found" });

  if (p.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const payload = req.body;

  
  if (req.files?.length > 0) {
    payload.images = req.files.map((f) => `/uploads/${f.filename}`);
  }

  
  payload.specs = {
    storage: payload.storage ?? p.specs.storage,
    ram: payload.ram ?? p.specs.ram,
    color: payload.color ?? p.specs.color,
    condition: payload.condition ?? p.specs.condition,
  };

  delete payload.storage;
  delete payload.ram;
  delete payload.color;
  delete payload.condition;

  Object.assign(p, payload);
  await p.save();

  res.json(p);
};

/* ============================================================
    DELETE PRODUCT
============================================================ */
export const deleteProduct = async (req, res) => {
  const p = await Product.findById(req.params.id);

  if (!p) return res.status(404).json({ message: "Product not found" });

  if (p.seller.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  await p.deleteOne();
  res.json({ message: "Deleted successfully" });
};
