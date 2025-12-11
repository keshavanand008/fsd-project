import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const nav = useNavigate();

  const [mine, setMine] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    brand: "",
    price: "",
    stock: "",
    images: [],
    storage: "",
    ram: "",
    color: "",
    condition: "used",
  });

  
  useEffect(() => {
    if (!user) nav("/login");
    else if (user.role !== "seller") nav("/");
  }, [user, nav]);

  
  const load = async () => {
    if (!user?._id) return;
    const { data } = await api.get("/products", {
      params: { seller: user._id },
    });
    setMine(data.items || []);
  };

  useEffect(() => {
    load();
  }, [user?._id]);

  
  const startEdit = (p) => {
    setEditMode(true);
    setEditId(p._id);

    setForm({
      title: p.title,
      description: p.description,
      brand: p.brand,
      price: p.price,
      stock: p.stock,
      images: [],
      storage: p.specs?.storage || "",
      ram: p.specs?.ram || "",
      color: p.specs?.color || "",
      condition: p.specs?.condition || "used",
    });
  };

  // ✅ delete product
  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    await load();
  };

  // ✅ create or update product
  const onSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("brand", form.brand);
    fd.append("price", form.price);
    fd.append("stock", form.stock);
    fd.append("storage", form.storage);
    fd.append("ram", form.ram);
    fd.append("color", form.color);
    fd.append("condition", form.condition);

    for (const f of form.images) fd.append("images", f);

    if (editMode) {
      await api.put(`/products/${editId}`, fd);
    } else {
      await api.post("/products", fd);
    }

    setEditMode(false);
    setEditId(null);

    setForm({
      title: "",
      description: "",
      brand: "",
      price: "",
      stock: "",
      images: [],
      storage: "",
      ram: "",
      color: "",
      condition: "used",
    });

    await load();
  };

  const API_BASE = import.meta.env.VITE_API_URL.replace("/api", "");

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* ✅ FORM SIDE */}
      <div className="card p-4">
        <h2 className="text-lg font-bold mb-2">
          {editMode ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={onSubmit} className="space-y-2">
          <input
            className="input"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="input"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="input"
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              className="input"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              placeholder="Storage"
              value={form.storage}
              onChange={(e) => setForm({ ...form, storage: e.target.value })}
            />
            <input
              className="input"
              placeholder="RAM"
              value={form.ram}
              onChange={(e) => setForm({ ...form, ram: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              placeholder="Color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            />
            <select
              className="input"
              value={form.condition}
              onChange={(e) =>
                setForm({ ...form, condition: e.target.value })
              }
            >
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="used">Used</option>
              <option value="for-parts">For Parts</option>
            </select>
          </div>

          <input
            type="file"
            multiple
            onChange={(e) =>
              setForm({ ...form, images: [...e.target.files] })
            }
          />

          <button className="btn btn-primary w-full">
            {editMode ? "Update Product" : "Create Product"}
          </button>
        </form>
      </div>

      {/*  PRODUCT LIST SIDE */}
      <div className="md:col-span-2 space-y-3">
        <h2 className="text-lg font-bold">My Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mine.map((p) => (
            <div key={p._id} className="card p-3">
              <div className="flex gap-3">
                <img
                  src={
                    p.images?.[0]
                      ? `${API_BASE}${p.images[0]}`
                      : "https://via.placeholder.com/160"
                  }
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-500">{p.brand}</div>
                  <div className="font-bold">₹{p.price}</div>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button className="btn btn-primary" onClick={() => startEdit(p)}>
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteProduct(p._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
