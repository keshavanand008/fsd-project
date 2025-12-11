import { useEffect, useState } from "react";
import api from "../utils/api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const { data } = await api.get("/orders/my");
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No orders yet.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {orders.map((order) => (
        <div key={order._id} className="card p-4 space-y-3">
          <div className="font-semibold">
            Order ID: {order._id}
          </div>

          <div className="text-sm text-gray-600">
            Status: {order.fulfillmentStatus}
          </div>

          <div className="border-t pt-2 space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  {item.title} <br />
                  <span className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </span>
                </div>

                <div>₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          <div className="font-bold text-right pt-2 border-t">
            Total: ₹{order.total}
          </div>
        </div>
      ))}
    </div>
  );
}
