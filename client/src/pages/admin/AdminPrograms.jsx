import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/programs', { params: { includeInactive: true } })
      .then((res) => setPrograms(res.data))
      .catch(() => setError('Could not load programs.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDeactivate = async (id) => {
    try {
      await api.patch(`/programs/${id}/deactivate`);
      setActionMsg('Program deactivated.');
      load();
    } catch (err) {
      setActionMsg('Failed to deactivate program.');
    }
  };

  const handleActivate = async (id) => {
    try {
      await api.patch(`/programs/${id}/activate`);
      setActionMsg('Program activated.');
      load();
    } catch (err) {
      setActionMsg('Failed to activate program.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this program? This cannot be undone.')) return;
    try {
      await api.delete(`/programs/${id}`);
      setActionMsg('Program deleted.');
      load();
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Failed to delete program.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading programs..." />;

   return (
    <div className="container py-4">
      <div className="pw-page-header d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <h1 className="pw-page-title">Manage Programs</h1>
          <p className="pw-page-subtitle">Create, edit, or deactivate programs in the catalog.</p>
        </div>
        <Link to="/admin/programs/new" className="btn btn-primary">+ Add Program</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {actionMsg && <div className="alert alert-info py-2">{actionMsg}</div>}

      <div className="table-responsive pw-card p-2">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th>Title</th>
              <th>University</th>
              <th>Fee</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.university_name}</td>
                <td>{p.currency} {Number(p.fee).toLocaleString('en-IN')}</td>
                <td>{p.duration_months} mo</td>
                                <td>
                  <span className={`pw-badge ${p.is_active ? 'pw-badge-status-active' : 'pw-badge-status-inactive'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-1 flex-wrap">
                    <Link to={`/admin/programs/${p.id}/edit`} className="btn btn-sm btn-outline-primary">Edit</Link>
                    {p.is_active ? (
                      <button className="btn btn-sm btn-outline-warning" onClick={() => handleDeactivate(p.id)}>Deactivate</button>
                    ) : (
                      <button className="btn btn-sm btn-outline-success" onClick={() => handleActivate(p.id)}>Activate</button>
                    )}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
