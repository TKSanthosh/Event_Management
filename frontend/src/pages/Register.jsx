import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">Event Management System</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              placeholder="john@example.com"
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
              placeholder="Min. 6 characters"
              required
              minLength={6}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
