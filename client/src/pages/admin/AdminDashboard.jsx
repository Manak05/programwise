import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => setStats(res.data))
      .catch(() => setError('Could not load dashboard statistics.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading admin dashboard..." />;

  const cards = stats ? [
    { label: 'Total Programs', value: stats.totalPrograms },
    { label: 'Active Programs', value: stats.activePrograms },
    { label: 'Universities', value: stats.universities },
    { label: 'Providers', value: stats.providers },
    { label: 'Categories', value: stats.categories },
    { label: 'Students', value: stats.students },
    { label: 'Total Saves', value: stats.totalSaves }
  ] : [];

    return (
    <div className="container py-4">
      <div className="pw-page-header">
        <h1 className="pw-page-title">Admin Dashboard</h1>
        <p className="pw-page-subtitle">Live counts from the database.</p>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        {cards.map((c) => (
          <div className="col-6 col-md-3" key={c.label}>
            <div className="pw-card p-3 text-center">
              <div className="fs-3 fw-bold text-primary">{c.value}</div>
              <div className="text-muted small">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="pw-card p-4">
            <h6>Manage Programs</h6>
            <p className="text-muted small">Create, edit, activate/deactivate, or delete programs.</p>
            <Link to="/admin/programs" className="btn btn-primary btn-sm">Go to Programs</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="pw-card p-4">
            <h6>Universities & Providers</h6>
            <p className="text-muted small">Manage universities, providers, categories, and career goals.</p>
            <Link to="/admin/lookups" className="btn btn-primary btn-sm">Manage Reference Data</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="pw-card p-4">
            <h6>Student View</h6>
            <p className="text-muted small">See how changes appear to students in real time.</p>
            <Link to="/explore" className="btn btn-outline-primary btn-sm">Open Explore Programs</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
