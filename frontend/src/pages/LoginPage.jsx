// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { BrainCircuit, Mail, Lock, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! JWT Token generated ✓');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-slide">
        <div className="auth-logo">
          <div className="flex items-center justify-between" style={{ justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <BrainCircuit size={36} color="#89b4fa" />
          </div>
          <h1>EmpAnalytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            AI-Based Employee Performance System
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              <Mail size={14} style={{ display: 'inline', marginRight: '6px' }} />
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              placeholder="admin@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              <Lock size={14} style={{ display: 'inline', marginRight: '6px' }} />
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button type="submit" id="login-btn" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <LogIn size={18} />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-blue)', fontWeight: 600, textDecoration: 'none' }}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
