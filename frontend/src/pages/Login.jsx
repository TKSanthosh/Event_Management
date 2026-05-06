import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
          <p className="text-sm text-gray-500 mt-1">Event Management System</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input"
              placeholder="••••••"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
