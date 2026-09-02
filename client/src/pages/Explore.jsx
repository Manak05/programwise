import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProgramCard from '../components/ProgramCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Explore() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    search: '', category: '', budgetMax: '', durationMax: '', delivery: '', experience: ''
  });

  const [savedIds, setSavedIds] = useState(new Set());
  const [compareIds, setCompareIds] = useState(() => {
    const stored = sessionStorage.getItem('pw_compare');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (user && user.role === 'student') {
      api.get('/saved-programs')
        .then((res) => setSavedIds(new Set(res.data.map((p) => p.id))))
        .catch(() => {});
    }
  }, [user]);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params[key] = val;
      });
      const res = await api.get('/programs', { params });
      setPrograms(res.data);
    } catch (err) {
      setError('Failed to load programs.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(fetchPrograms, 300); // debounce search typing
    return () => clearTimeout(timer);
  }, [fetchPrograms]);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSave = async (programId) => {
    if (!user) return navigate('/login');
    try {
      await api.post(`/saved-programs/${programId}`);
      setSavedIds((prev) => new Set(prev).add(programId));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not save program.');
    }
  };

  const handleUnsave = async (programId) => {
    try {
      await api.delete(`/saved-programs/${programId}`);
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(programId);
        return next;
      });
    } catch (err) {
      alert('Could not remove saved program.');
    }
  };

  const toggleCompare = (programId) => {
    setCompareIds((prev) => {
      const next = new Set(prev);
      if (next.has(programId)) {
        next.delete(programId);
      } else {
        if (next.size >= 3) {
          alert('You can compare up to 3 programs at a time.');
          return prev;
        }
        next.add(programId);
      }
      sessionStorage.setItem('pw_compare', JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <div className="container py-4">
      <div className="pw-page-header d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <h1 className="pw-page-title">Explore Programs</h1>
          <p className="pw-page-subtitle">Search and filter the full program catalog.</p>
        </div>
        {compareIds.size >= 2 && (
          <button className="btn btn-primary" onClick={() => navigate(`/compare?ids=${[...compareIds].join(',')}`)}>
            Compare Selected ({compareIds.size})
          </button>
        )}
      </div>

      <div className="pw-card pw-filter-bar p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="pw-filter-label">Search</label>
            <input
              type="text" className="form-control" placeholder="Title, description or university"
              name="search" value={filters.search} onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-2">
            <label className="pw-filter-label">Category</label>
            <select className="form-select" name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <label className="pw-filter-label">Delivery</label>
            <select className="form-select" name="delivery" value={filters.delivery} onChange={handleFilterChange}>
              <option value="">Any</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="pw-filter-label">Experience</label>
            <select className="form-select" name="experience" value={filters.experience} onChange={handleFilterChange}>
              <option value="">Any</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Experienced">Experienced</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="pw-filter-label">Max Fee (₹)</label>
            <input
              type="number" className="form-control" placeholder="Any"
              name="budgetMax" value={filters.budgetMax} onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="row g-3 mt-1">
          <div className="col-md-3">
            <label className="pw-filter-label">Max Duration (months)</label>
            <input
              type="number" className="form-control" placeholder="Any"
              name="durationMax" value={filters.durationMax} onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <LoadingSpinner label="Loading programs..." />
      ) : programs.length === 0 ? (
        <div className="pw-empty-state pw-card">
          <p className="mb-0">No programs match these filters. Try widening your search.</p>
        </div>
      ) : (
        <div className="row">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              isSaved={savedIds.has(program.id)}
              onSave={handleSave}
              onUnsave={handleUnsave}
              isInCompare={compareIds.has(program.id)}
              onToggleCompare={toggleCompare}
              hideSave={user?.role === 'admin'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
