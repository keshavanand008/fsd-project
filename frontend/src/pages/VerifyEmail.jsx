import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api.js";

export default function VerifyEmail() {
  const { token } = useParams();
  const [msg, setMsg] = useState("Verifying...");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/auth/verify/${token}`);
        setMsg(data.message);
      } catch (err) {
        setMsg(err.response?.data?.message || "Verification failed");
      }
    })();
  }, [token]);

  return (
    <div className="max-w-lg mx-auto mt-20 card p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">{msg}</h2>
      
      <Link to="/login" className="btn btn-primary">
        Go to Login
      </Link>
    </div>
  );
}
