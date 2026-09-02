import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Compare() {
  const [searchParams] = useSearchParams();
  const ids = searchParams.get('ids');

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ids) {
      setLoading(false);
      return;
    }
    api.get('/programs/compare', { params: { ids } })
      .then((res) => setPrograms(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load comparison.'))
      .finally(() => setLoading(false));
  }, [ids]);

  if (loading) return <LoadingSpinner label="Loading comparison..." />;

  if (!ids || programs.length < 2) {
    return (
      <div className="container py-5">
        <div className="pw-empty-state pw-card">
          <p>Select 2–3 programs from Explore Programs to compare them here.</p>
          <Link to="/explore" className="btn btn-primary btn-sm">Explore Programs</Link>
        </div>
      </div>
    );
  }

  const rows = [
    { label: 'University', key: 'university_name' },
    { label: 'Provider', key: 'provider_name' },
    { label: 'Category', key: 'category_name' },
    { label: 'Fee', render: (p) => `${p.currency} ${Number(p.fee).toLocaleString('en-IN')}` },
    { label: 'Duration', render: (p) => `${p.duration_months} months` },
    { label: 'Delivery', key: 'delivery_mode' },
    { label: 'Experience Level', key: 'experience_level' },
    { label: 'Career Goals', render: (p) => (p.career_goals || []).join(', ') || '—' },
    { label: 'Outcomes', key: 'outcomes' }
  ];

  return (

    <div className="container py-4">
      <div className="pw-page-header">
        <h1 className="pw-page-title">Program Comparison</h1>
        <p className="pw-page-subtitle">Side-by-side view of your selected programs.</p>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive pw-card p-2">
        <table className="table table-bordered mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: 180 }}>Factor</th>
              {programs.map((p) => <th key={p.id}>{p.title}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="fw-semibold">{row.label}</td>
                {programs.map((p) => (
                  <td key={p.id}>{row.render ? row.render(p) : (p[row.key] ?? '—')}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="fw-semibold">Details</td>
              {programs.map((p) => (
                <td key={p.id}><Link to={`/programs/${p.id}`} className="btn btn-sm btn-outline-primary">View</Link></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
