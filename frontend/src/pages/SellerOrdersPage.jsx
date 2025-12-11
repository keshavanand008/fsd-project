import { useEffect, useState } from "react";
import api from "../utils/api";
import { useSelector } from "react-redux";

const API_BASE = import.meta.env.VITE_API_URL.replace("/api", "");

export default function SellerOrdersPage() {
  const { user } = useSelector((s) => s.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data } = await api.get("/orders/seller");   
      setOrders(data);
    } catch (err) {
      console.error("Seller Orders Error:", err);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, {   
        status: newStatus
      });

      alert("Order status updated!");
      loadOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (!user || user.role !== "seller") {
    return (
      <div className="text-center mt-10 text-xl font-bold">
        Access Denied
      </div>
    );
  }

  if (loading)
    return <div className="text-center mt-10 text-lg">Loading orders...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Orders for Your Products</h1>

      {orders.length === 0 && (
        <div className="text-gray-600 mt-6">No orders yet.</div>
      )}

      {orders.map((order) => (
        <div key={order._id} className="card p-4 space-y-3">

          {/* Header */}
          <div className="flex justify-between">
            <div className="font-bold">Order ID: {order._id}</div>
            <div className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>

          {/* Items for THIS seller */}
          <div className="border-t pt-3 space-y-3">
            {order.items
              .filter(
                (i) =>
                  i.product &&
                  i.product.seller &&
                  i.product.seller.toString() === user._id
              )
              .map((item) => (
                <div key={item.product._id} className="flex gap-3 items-center">
                  <img
                    src={
                      item.image
                        ? API_BASE + item.image
                        : "https://via.placeholder.com/80"
                    }
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="font-bold">₹{item.price}</div>
                </div>
              ))}
          </div>

          {/* Buyer details */}
          <div className="pt-3 border-t">
            <div className="text-sm">
              Buyer: {order.address.name}, {order.address.phone}
            </div>
            <div className="text-sm text-gray-600">
              Shipping: {order.address.line1}, {order.address.city},{" "}
              {order.address.state} - {order.address.pincode}
            </div>
          </div>

          {/* Status */}
          <div className="border-t pt-3 flex justify-between items-center">
            <div className="font-semibold">
              Status:{" "}
              <span className="text-blue-600">{order.fulfillmentStatus}</span>
            </div>

            <div className="flex gap-2">
              {order.fulfillmentStatus === "processing" && (
                <button
                  className="btn"
                  onClick={() => updateStatus(order._id, "shipped")}
                >
                  Mark Shipped
                </button>
              )}

              {order.fulfillmentStatus === "shipped" && (
                <button
                  className="btn btn-primary"
                  onClick={() => updateStatus(order._id, "delivered")}
                >
                  Mark Delivered
                </button>
              )}

              {order.fulfillmentStatus !== "cancelled" &&
                order.fulfillmentStatus !== "delivered" && (
                  <button
                    className="btn btn-danger"
                    onClick={() => updateStatus(order._id, "cancelled")}
                  >
                    Cancel
                  </button>
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
