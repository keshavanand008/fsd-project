import { useDispatch, useSelector } from 'react-redux';
import { register } from '../slices/authSlice.js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    shopName: '',
    bio: ''
  });

  const { status, error } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(register(form));

    if (res.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto card space-y-3">
      <h2 className="text-xl font-bold">Create account</h2>

      {/* ✅ Show backend validation errors */}
      {error && (
        <div className="text-red-600 text-sm space-y-1">
          {typeof error === 'string'
            ? <div>{error}</div>
            : Array.isArray(error) &&
              error.map((e, i) => (
                <div key={i}>{e.msg}</div>
              ))
          }
        </div>
      )}

      <input
        className="border rounded-xl px-3 py-2"
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="border rounded-xl px-3 py-2"
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        className="border rounded-xl px-3 py-2"
        placeholder="Password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={form.role === 'buyer'}
            onChange={() => setForm({ ...form, role: 'buyer' })}
          /> Buyer
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={form.role === 'seller'}
            onChange={() => setForm({ ...form, role: 'seller' })}
          /> Seller
        </label>
      </div>

      {form.role === 'seller' && (
        <div className="space-y-2">
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Shop name"
            value={form.shopName}
            onChange={e => setForm({ ...form, shopName: e.target.value })}
          />

          <textarea
            className="border rounded-xl px-3 py-2"
            placeholder="Shop bio"
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
          />
        </div>
      )}

      <button disabled={status === 'loading'} className="btn btn-primary">
        {status === 'loading' ? '...' : 'Register'}
      </button>
    </form>
  );
}
