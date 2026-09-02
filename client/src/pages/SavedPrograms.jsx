import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgramCard from '../components/ProgramCard';

export default function SavedPrograms() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compareIds, setCompareIds] = useState(() => {
    const stored = sessionStorage.getItem('pw_compare');
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  const load = () => {
    setLoading(true);
    api.get('/saved-programs')
      .then((res) => setPrograms(res.data))
      .catch(() => setError('Could not load saved programs.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUnsave = async (programId) => {
    try {
      await api.delete(`/saved-programs/${programId}`);
      setPrograms((prev) => prev.filter((p) => p.id !== programId));
    } catch (err) {
      alert('Could not remove program.');
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

  if (loading) return <LoadingSpinner label="Loading saved programs..." />;

  return (
    <div className="container py-4">
      <div className="pw-page-header d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <h1 className="pw-page-title">Saved Programs</h1>
          <p className="pw-page-subtitle">Programs you've shortlisted so far.</p>
        </div>
        {compareIds.size >= 2 && (
          <button className="btn btn-primary" onClick={() => navigate(`/compare?ids=${[...compareIds].join(',')}`)}>
            Compare Selected ({compareIds.size})
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {programs.length === 0 ? (
        <div className="pw-empty-state pw-card">
          <p>You haven't saved any programs yet.</p>
          <Link to="/explore" className="btn btn-primary btn-sm">Explore Programs</Link>
        </div>
      ) : (
        <div className="row">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              isSaved={true}
              onSave={() => {}}
              onUnsave={handleUnsave}
              isInCompare={compareIds.has(program.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>
      )}
    </div>
  );
}