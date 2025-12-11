import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateQuantity,
  removeItem,
} from "../slices/cartSlice.js";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items, status } = useSelector((s) => s.cart);
  const nav = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL.replace("/api", "");

  /*  Protect Cart (redirect if user not logged in) + Load Cart */
  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
    dispatch(fetchCart());
  }, [user]);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (status === "loading") {
    return <div className="p-4 text-lg">Updating cart...</div>;
  }

  if (items.length === 0)
    return (
      <div className="max-w-3xl mx-auto text-center mt-10">
        <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
        <p className="text-gray-600 mt-2">Looks like you haven't added anything yet.</p>

        <Link to="/" className="btn btn-primary mt-4 inline-block">
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mt-6">
      {/* LEFT — Items */}
      <div className="md:col-span-2 space-y-4">
        {items.map((item) => (
          <div key={item._id} className="card p-4 flex gap-4 items-center">
            <img
              src={
                item.product.images?.[0]
                  ? API_BASE + item.product.images[0]
                  : "https://via.placeholder.com/120"
              }
              className="w-24 h-24 object-cover rounded-xl"
            />

            <div className="flex-1">
              <div className="font-semibold text-lg">{item.product.title}</div>
              <div className="text-gray-500 text-sm">{item.product.brand}</div>

              <div className="font-bold text-lg mt-1">
                ₹{item.product.price}
              </div>

              {/* Only X left */}
              {item.product.stock <= 2 && (
                <div className="text-sm text-red-600">
                  Only {item.product.stock} left
                </div>
              )}

              {/* Out of Stock */}
              {item.product.stock === 0 && (
                <div className="text-sm text-red-500 font-bold">
                  This product is now out of stock
                </div>
              )}

              {/* QUANTITY CONTROL */}
              <div className="flex items-center gap-3 mt-3">
                {/* Decrease */}
                <button
                  className="px-3 py-1 rounded-xl border hover:bg-gray-100 disabled:opacity-50"
                  disabled={item.quantity <= 1}
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        itemId: item._id,
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    )
                  }
                >
                  -
                </button>

                <span className="font-semibold">{item.quantity}</span>

                {/* Increase */}
                <button
                  className="px-3 py-1 rounded-xl border hover:bg-gray-100 disabled:opacity-50"
                  disabled={item.quantity >= item.product.stock}
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        itemId: item._id,
                        quantity: item.quantity + 1,
                      })
                    )
                  }
                >
                  +
                </button>

                {/* Remove */}
                <button
                  className="btn btn-danger ml-4"
                  onClick={() => dispatch(removeItem(item._id))}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT — Summary */}
      <div className="card p-4 h-fit sticky top-20">
        <h2 className="text-xl font-bold mb-3">Order Summary</h2>

        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Items:</span>
          <span className="font-semibold">{items.length}</span>
        </div>

        <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3">
          <span>Total:</span>
          <span>₹{total}</span>
        </div>

        {/* Checkout navigation */}
        <button
          onClick={() => nav("/checkout")}
          className="btn btn-primary w-full mt-4 text-lg"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
