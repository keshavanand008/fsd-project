import { useEffect, useState } from "react";
import api from "../utils/api.js";
import { Link } from "react-router-dom";

export default function Home() {
  const [q, setQ] = useState("");
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });

  const API_BASE = import.meta.env.VITE_API_URL.replace("/api", ""); //  FIXED

  const fetchData = async (page = 1) => {
    const { data } = await api.get("/products", { params: { q, page } });
    setData(data);
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  return (
    <div className="space-y-4">
      {/* SEARCH */}
      <div className="flex gap-2">
        <input
          className="input w-full border rounded-xl px-3 py-2"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search mobiles..."
        />
        <button onClick={() => fetchData(1)} className="btn btn-primary">
          Search
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.items.map((p) => (
          <Link
            to={`/product/${p._id}`}
            key={p._id}
            className="card hover:shadow-lg p-2"
          >
            {/*  FIXED IMAGE URL */}
            <img
              src={
                p.images?.[0]
                  ? API_BASE + p.images[0]
                  : "https://via.placeholder.com/400x300?text=No+Image"
              }
              className="w-full h-48 object-cover rounded-xl"
              alt={p.title}
            />

            {/* PRODUCT INFO */}
            <div className="mt-2">
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-500">{p.brand}</div>
              <div className="mt-1 font-bold">₹{p.price}</div>
              <div className="text-xs">
                ⭐ {p.rating?.toFixed?.(1) || 0} ({p.numReviews || 0})
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex gap-2">
        <button
          disabled={data.page <= 1}
          onClick={() => fetchData(data.page - 1)}
          className="btn"
        >
          Prev
        </button>

        <div className="px-3 py-2">
          Page {data.page} / {data.pages}
        </div>

        <button
          disabled={data.page >= data.pages}
          onClick={() => fetchData(data.page + 1)}
          className="btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}
