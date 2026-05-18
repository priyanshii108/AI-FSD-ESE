// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { BrainCircuit, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'hr' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card animate-slide">
        <div className="auth-logo">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <BrainCircuit size={36} color="#89b4fa" />
          </div>
          <h1>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            HR Admin Registration
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {[
            { id: 'reg-name', label: 'Full Name', type: 'text', field: 'name', placeholder: 'John Doe' },
            { id: 'reg-email', label: 'Email Address', type: 'email', field: 'email', placeholder: 'john@company.com' },
            { id: 'reg-password', label: 'Password', type: 'password', field: 'password', placeholder: '••••••••' },
          ].map(({ id, label, type, field, placeholder }) => (
            <div className="form-group" key={field}>
              <label className="form-label" htmlFor={id}>{label}</label>
              <input id={id} type={type} className="form-control" placeholder={placeholder}
                value={form[field]} onChange={set(field)} />
              {errors[field] && <span className="form-error">{errors[field]}</span>}
            </div>
          ))}

          <div className="form-group">
            <label className="form-label" htmlFor="reg-role">Role</label>
            <select id="reg-role" className="form-control" value={form.role} onChange={set('role')}>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" id="register-btn" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <UserPlus size={18} />}
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="divider" />
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
