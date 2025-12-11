import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/authSlice.js';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { status, error } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login({ email, password }));

    if (res.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto card space-y-3">
      <h2 className="text-xl font-bold">Login</h2>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <input
        className="border rounded-xl px-3 py-2"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border rounded-xl px-3 py-2"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button disabled={status === 'loading'} className="btn btn-primary">
        {status === 'loading' ? '...' : 'Login'}
      </button>

      <div className="text-sm">
        No account? <Link to="/register" className="underline">Register</Link>
      </div>
    </form>
  );
}
