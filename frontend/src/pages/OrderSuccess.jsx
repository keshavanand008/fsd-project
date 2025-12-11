import { Link, useParams } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="max-w-lg mx-auto text-center card p-6">
      <h2 className="text-2xl font-bold text-green-600">Order Placed!</h2>
      <p className="mt-2">Your order has been successfully placed.</p>

      <div className="mt-4 text-sm text-gray-600">
        Order ID: <span className="font-mono">{id}</span>
      </div>

      <Link to="/orders" className="btn btn-primary mt-6 w-full">
        View My Orders
      </Link>

      <Link to="/" className="btn mt-3 w-full">
        Continue Shopping
      </Link>
    </div>
  );
}
