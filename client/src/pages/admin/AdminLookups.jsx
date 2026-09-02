import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const TABS = [
  { key: 'universities', label: 'Universities', hasExtra: true },
  { key: 'providers', label: 'Providers', hasExtra: true },
  { key: 'categories', label: 'Categories', hasExtra: false },
  { key: 'career-goals', label: 'Career Goals', hasExtra: false }
];

export default function AdminLookups() {
  const [activeTab, setActiveTab] = useState('universities');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', website: '' });
  const [editingId, setEditingId] = useState(null);

  const currentTab = TABS.find((t) => t.key === activeTab);

  const load = () => {
    setLoading(true);
    api.get(`/${activeTab}`)
      .then((res) => setItems(res.data))
      .catch(() => setError('Could not load data.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setForm({ name: '', description: '', website: '' });
    setEditingId(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/${activeTab}/${editingId}`, form);
      } else {
        await api.post(`/${activeTab}`, form);
      }
      setForm({ name: '', description: '', website: '' });
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save record.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ name: item.name, description: item.description || '', website: item.website || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record? Programs referencing it may be affected.')) return;
    try {
      await api.delete(`/${activeTab}/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete record. It may be referenced by existing programs.');
    }
  };

   return (
    <div className="container py-4">
      <div className="pw-page-header">
        <h1 className="pw-page-title">Manage Reference Data</h1>
        <p className="pw-page-subtitle">Universities, providers, categories and career goals.</p>
      </div>

      <ul className="nav nav-pills mb-4">
        {TABS.map((t) => (
          <li className="nav-item" key={t.key}>
            <button
              className={`nav-link ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-5">
          <div className="pw-card p-3">
            <h6>{editingId ? `Edit ${currentTab.label.slice(0, -1)}` : `Add ${currentTab.label.slice(0, -1)}`}</h6>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label small">Name</label>
                <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
              </div>
              {currentTab.hasExtra && (
                <>
                  <div className="mb-2">
                    <label className="form-label small">Description</label>
                    <textarea className="form-control" name="description" rows="2" value={form.description} onChange={handleChange} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">Website</label>
                    <input className="form-control" name="website" value={form.website} onChange={handleChange} />
                  </div>
                </>
              )}
              <button className="btn btn-primary btn-sm mt-2" type="submit">
                {editingId ? 'Update' : 'Add'}
              </button>
              {editingId && (
                <button
                  type="button" className="btn btn-outline-secondary btn-sm mt-2 ms-2"
                  onClick={() => { setEditingId(null); setForm({ name: '', description: '', website: '' }); }}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>
        </div>

        <div className="col-md-7">
          {loading ? <LoadingSpinner /> : (
            <div className="pw-card p-2">
              <table className="table align-middle mb-0">
                <thead><tr><th>Name</th><th></th></tr></thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(item)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan="2" className="text-muted text-center py-3">No records yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
