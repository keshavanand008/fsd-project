import { useEffect, useState } from "react";
import api from "../utils/api";
import { useSelector } from "react-redux";

const API_BASE = import.meta.env.VITE_API_URL.replace("/api", "");

export default function SellerDashboard() {
  const { user } = useSelector((s) => s.auth);

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    brand: "",
    price: "",
    stock: "",
    description: "",
    ram: "",
    storage: "",
    color: "",
    images: []
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newImages, setNewImages] = useState([]);

  // Load products
  const loadProducts = async () => {
    const { data } = await api.get("/products?seller=me");
    setProducts(data.items);
  };

  useEffect(() => {
    if (user?.role === "seller") loadProducts();
  }, [user]);

  // Upload images to backend
  const uploadFiles = async (files) => {
    const fd = new FormData();
    for (let f of files) fd.append("files", f);
    const { data } = await api.post("/uploads", fd);
    return data.paths;
  };

  // Add new product
  const onSubmit = async (e) => {
    e.preventDefault();
    let imagePaths = [];
    if (form.images?.length > 0) imagePaths = await uploadFiles(form.images);

    await api.post("/products", { ...form, price: +form.price, stock: +form.stock, images: imagePaths });
    alert("✅ Product added!");
    setForm({ title: "", brand: "", price: "", stock: "", description: "", ram: "", storage: "", color: "", images: [] });
    loadProducts();
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  // Open edit modal
  const startEdit = (p) => {
    setEditingProduct(p);
    setEditForm({
      title: p.title,
      brand: p.brand,
      price: p.price,
      stock: p.stock,
      description: p.description,
      ram: p.specs?.ram,
      storage: p.specs?.storage,
      color: p.specs?.color,
      images: p.images || []
    });
    setNewImages([]);
  };

  // Save updated product
  const saveEdit = async () => {
    try {
      let updatedImages = editForm.images;
      if (newImages.length > 0) {
        const uploaded = await uploadFiles(newImages);
        updatedImages = uploaded;
      }

      await api.put(`/products/${editingProduct._id}`, {
        ...editForm,
        price: +editForm.price,
        stock: +editForm.stock,
        images: updatedImages
      });

      alert("✅ Product updated successfully!");
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update product");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>

      {/* ✅ Add Product Form */}
      <form onSubmit={onSubmit} className="card p-4 space-y-3">
        <h2 className="text-xl font-semibold">Add New Product</h2>
        <input className="input border rounded-xl px-3 py-2" placeholder="Title"
          value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className="input border rounded-xl px-3 py-2" placeholder="Brand"
          value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        <input type="number" className="input border rounded-xl px-3 py-2" placeholder="Price"
          value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input type="number" className="input border rounded-xl px-3 py-2" placeholder="Stock"
          value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <textarea className="input border rounded-xl px-3 py-2" placeholder="Description"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid grid-cols-3 gap-3">
          <input className="input border rounded-xl px-3 py-2" placeholder="RAM"
            value={form.ram} onChange={(e) => setForm({ ...form, ram: e.target.value })} />
          <input className="input border rounded-xl px-3 py-2" placeholder="Storage"
            value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })} />
          <input className="input border rounded-xl px-3 py-2" placeholder="Color"
            value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
        </div>
        <input type="file" multiple onChange={(e) => setForm({ ...form, images: e.target.files })} />
        <button className="btn btn-primary w-full">Add Product</button>
      </form>

      {/* ✅ My Products */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">My Products</h2>
        {products.length === 0 && <div className="text-gray-500">No products yet.</div>}
        {products.map((p) => (
          <div key={p._id} className="card flex items-center p-3 gap-4 justify-between">
            <div className="flex items-center gap-3">
              <img src={p.images?.[0] ? API_BASE + p.images[0] : "https://via.placeholder.com/120"}
                className="w-20 h-20 object-cover rounded-xl" />
              <div>
                <div className="font-bold">{p.title}</div>
                <div className="text-sm text-gray-600">{p.brand}</div>
                <div className="mt-1 font-semibold">₹{p.price}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn" onClick={() => startEdit(p)}>Edit</button>
              <button className="btn btn-danger" onClick={() => deleteProduct(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* 🪩 Modern Glass Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 w-[420px] shadow-2xl space-y-4 border border-white/40 animate-slideUp relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition"
              onClick={() => setEditingProduct(null)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-center text-gray-800">
              ✏️ Edit Product
            </h2>

            <div className="space-y-2">
              <input className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 transition"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Title"
              />
              <input className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 transition"
                value={editForm.brand}
                onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
                placeholder="Brand"
              />
              <input className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 transition"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                placeholder="Price"
              />
              <input className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 transition"
                value={editForm.stock}
                onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                placeholder="Stock"
              />
              <textarea className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-400 transition"
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Description"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-gray-700">Current Images</label>
              <div className="grid grid-cols-3 gap-2">
                {editForm.images.map((img, i) => (
                  <img
                    key={i}
                    src={API_BASE + img}
                    className="h-20 w-full object-cover rounded-lg border shadow-sm"
                  />
                ))}
              </div>

              <label className="block mt-3 font-semibold text-gray-700">Replace Images</label>
              <input
                type="file"
                multiple
                onChange={(e) => setNewImages([...e.target.files])}
                className="text-sm"
              />
              {newImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {Array.from(newImages).map((f, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(f)}
                      className="h-20 w-full object-cover rounded-lg border shadow-md"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition font-medium"
                onClick={() => setEditingProduct(null)}>
                Cancel
              </button>
              <button className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow-md hover:shadow-blue-300"
                onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
