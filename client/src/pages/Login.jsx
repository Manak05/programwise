import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'student') setForm({ email: 'student@demo.com', password: 'Student@123' });
    else setForm({ email: 'admin@demo.com', password: 'Admin@123' });
  };

    return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <div className="pw-card p-4">
        <h1 className="pw-page-title mb-1">Welcome back</h1>
        <p className="pw-page-subtitle mb-3">Log in to continue to ProgramWise.</p>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center my-3 text-muted small">Quick demo access</div>
        <div className="d-flex gap-2 mb-3">
          <button className="btn btn-outline-secondary btn-sm w-50" onClick={() => fillDemo('student')}>Fill Student Demo</button>
          <button className="btn btn-outline-secondary btn-sm w-50" onClick={() => fillDemo('admin')}>Fill Admin Demo</button>
        </div>

        <div className="text-center small">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}
