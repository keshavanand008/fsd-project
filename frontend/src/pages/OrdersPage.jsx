import { useEffect, useState } from "react";
import api from "../utils/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL.replace("/api", "");

export default function OrdersPage() {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return navigate("/login");
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const { data } = await api.get("/orders/my");
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center">
        <h1 className="text-2xl font-bold">No Orders Yet</h1>
        <p className="text-gray-600 mt-2">Start shopping to place your first order.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6 p-4">
      <h1 className="text-3xl font-bold">My Orders</h1>

      {orders.map((order) => (
        <div key={order._id} className="card p-4 space-y-4">
          <div className="flex justify-between">
            <div>
              <div className="font-bold text-lg">Order #{order._id.slice(-6)}</div>
              <div className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="text-right">
              <div className="font-semibold text-lg">₹{order.total}</div>
              <div
                className={
                  "text-sm font-semibold " +
                  (order.fulfillmentStatus === "delivered"
                    ? "text-green-600"
                    : order.fulfillmentStatus === "cancelled"
                    ? "text-red-600"
                    : "text-blue-600")
                }
              >
                {order.fulfillmentStatus}
              </div>
            </div>
          </div>

          {/* Order Items */}
          {order.items.map((item) => (
            <div key={item.product} className="flex items-center gap-4 py-2 border-t">
              <img
                src={
                  item.image
                    ? API_BASE + item.image
                    : "https://via.placeholder.com/80"
                }
                className="w-20 h-20 object-cover rounded-lg"
              />

              <div className="flex-1">
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-gray-600">Qty: {item.qty}</div>
              </div>

              <div className="font-semibold">₹{item.price * item.qty}</div>
            </div>
          ))}

          {/* Address */}
          <div className="border-t pt-3">
            <div className="font-semibold text-lg">Delivery Address</div>
            <div className="text-sm text-gray-700 mt-1">
              {order.address.name} — {order.address.phone}
              <br />
              {order.address.line1}
              <br />
              {order.address.city}, {order.address.state} — {order.address.pincode}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
