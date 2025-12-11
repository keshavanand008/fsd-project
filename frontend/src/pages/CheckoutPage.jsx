import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../slices/cartSlice";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);

  // ✅ Address fields (matching backend model)
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    if (!user) return navigate("/login");
    dispatch(fetchCart());
  }, [user]);

  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  const placeOrder = async () => {
    // VALIDATION
    if (!address.name || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode) {
      alert("Please fill all address fields");
      return;
    }

    try {
      await api.post("/orders", { address });

      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("Order failed. Try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <h1 className="text-xl font-bold">Your cart is empty.</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* ✅ Order Summary */}
      <div className="card p-4 space-y-3">
        <h2 className="text-lg font-semibold">Order Summary</h2>

        {items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between border-b py-2"
          >
            <div>
              <div className="font-semibold">{item.product.title}</div>
              <div className="text-sm text-gray-600">
                Qty: {item.quantity}
              </div>
            </div>
            <div>₹{item.product.price * item.quantity}</div>
          </div>
        ))}

        <div className="flex justify-between font-bold text-xl mt-3">
          <span>Total:</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* ✅ Address */}
      <div className="card p-4 space-y-3">
        <h2 className="text-lg font-semibold">Delivery Address</h2>

        <input
          className="input border rounded-xl px-3 py-2 w-full"
          placeholder="Full Name"
          value={address.name}
          onChange={(e) => setAddress({ ...address, name: e.target.value })}
        />

        <input
          className="input border rounded-xl px-3 py-2 w-full"
          placeholder="Phone Number"
          value={address.phone}
          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
        />

        <input
          className="input border rounded-xl px-3 py-2 w-full"
          placeholder="Address Line"
          value={address.line1}
          onChange={(e) => setAddress({ ...address, line1: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            className="input border rounded-xl px-3 py-2 w-full"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />

          <input
            className="input border rounded-xl px-3 py-2 w-full"
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
          />
        </div>

        <input
          className="input border rounded-xl px-3 py-2 w-full"
          placeholder="Pincode"
          value={address.pincode}
          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
        />
      </div>

      {/*  Place Order */}
      <button
        className="btn btn-primary w-full text-lg"
        onClick={placeOrder}
      >
        Place Order
      </button>
    </div>
  );
}
