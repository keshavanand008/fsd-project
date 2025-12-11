import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice.js";
import { ChevronLeft, ChevronRight } from "lucide-react"; // modern icons

export default function ProductPage() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const nav = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL.replace("/api", "");

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/products/${id}`);
      setP(data);
    })();
  }, [id]);

  if (!p) return <div className="text-center mt-10 text-lg">Loading...</div>;

  const images = p.images?.length ? p.images : ["/placeholder.png"];

  const nextImage = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  const onAdd = () => {
    if (!user) return nav("/login");
    if (p.stock === 0) return alert("This product is out of stock");
    if (qty > p.stock) return alert(`Only ${p.stock} item(s) in stock`);
    dispatch(addToCart({ productId: p._id, quantity: qty }));
    alert("Added to cart");
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/*  LEFT — IMAGE CAROUSEL  */}
      <div className="relative">
        <img
          src={
            images[current]
              ? API_BASE + images[current]
              : "https://via.placeholder.com/600x400?text=Mobile"
          }
          className="w-full rounded-2xl object-cover transition-all duration-500 shadow-md"
        />

        {/*  Modern Arrow Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 hover:bg-blue-500 hover:text-white text-gray-700 p-2 rounded-full shadow-md transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextImage}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 hover:bg-blue-500 hover:text-white text-gray-700 p-2 rounded-full shadow-md transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/*  Thumbnails */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {images.map((src, i) => (
            <img
              key={i}
              src={API_BASE + src}
              onClick={() => setCurrent(i)}
              className={`rounded-xl h-20 w-full object-cover cursor-pointer border-2 transition-all ${
                i === current
                  ? "border-blue-500 scale-105"
                  : "border-transparent hover:scale-105"
              }`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT — PRODUCT INFO  */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">{p.title}</h1>

        <div className="text-gray-600">
          {p.brand} • {p.specs?.storage} • {p.specs?.ram} • {p.specs?.color}
        </div>

        <div className="text-3xl font-extrabold">₹{p.price}</div>

        <div className="text-sm">
          Stock:{" "}
          {p.stock === 0 ? (
            <span className="text-red-600 font-semibold">Out of Stock</span>
          ) : (
            p.stock
          )}
        </div>

        <p className="text-gray-700 leading-relaxed">{p.description}</p>

        {/*  Quantity + Add to Cart */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max={p.stock}
            value={qty}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (v > p.stock) return setQty(p.stock);
              if (v < 1) return setQty(1);
              setQty(v);
            }}
            className="border rounded-xl px-3 py-2 w-24"
            disabled={p.stock === 0}
          />

          <button
            onClick={onAdd}
            disabled={p.stock === 0}
            className="btn btn-primary disabled:opacity-50"
          >
            {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
