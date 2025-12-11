import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CartPage from "./pages/CartPage.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import SellerOrdersPage from "./pages/SellerOrdersPage.jsx"; 

import { useDispatch, useSelector } from "react-redux";
import { logout } from "./slices/authSlice.js";
import { useEffect } from "react";
import { fetchCart } from "./slices/cartSlice.js";

export default function App() {
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const nav = useNavigate();

  // auto load cart after login
  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    nav("/");
  };

  const cartTotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div>
      <nav className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">

          <Link to="/" className="flex items-center gap-2 font-bold text-lg group">
  
  <div className="relative w-6 h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-xl shadow-md flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
    <div className="absolute bottom-1 w-2 h-0.5 bg-white rounded-full opacity-90"></div>
  </div>
  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:brightness-125 transition">
    Mobile Market
  </span>
</Link>


          <div className="ml-auto flex items-center gap-4">
            <Link to={user ? "/cart" : "/login"} className="btn btn-primary">
              Cart ({items.length}) – ₹{cartTotal}
            </Link>

            {user ? (
              <>
                <span className="text-sm">Hi, {user.name}</span>

                {user.role === "seller" && (
                  <>
                    <Link to="/seller" className="btn">Seller Dashboard</Link>
                    <Link to="/seller/orders" className="btn">Orders</Link>
                  </>
                )}

                <button onClick={handleLogout} className="btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}

          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<CartPage />} />

         
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />

         
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/orders" element={<SellerOrdersPage />} />
        </Routes>
      </main>
    </div>
  );
}
