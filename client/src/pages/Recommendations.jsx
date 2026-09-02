import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import MatchBadge from '../components/MatchBadge';


export default function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedIds, setSavedIds] = useState(new Set());
  const [activeProfileName, setActiveProfileName] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [recRes, savedRes, profileRes] = await Promise.all([
          api.post('/recommendations'),
          api.get('/saved-programs'),
          api.get('/preferences')
        ]);
        setRecs(recRes.data);
        setSavedIds(new Set(savedRes.data.map((p) => p.id)));
        const active = profileRes.data.find((p) => p.is_active);
        if (active) setActiveProfileName(active.profile_name);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load recommendations.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (programId) => {
    try {
      await api.post(`/saved-programs/${programId}`);
      setSavedIds((prev) => new Set(prev).add(programId));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not save program.');
    }
  };

  if (loading) return <LoadingSpinner label="Calculating your matches..." />;

  if (error) {
    return (
      <div className="container py-5">
        <div className="pw-empty-state pw-card">
          <p>{error}</p>
          <Link to="/preferences" className="btn btn-primary btn-sm">Set Preferences</Link>
        </div>
      </div>
    );
  }

   return (
    <div className="container py-4">
      <div className="pw-page-header d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <h1 className="pw-page-title">My Recommendations</h1>
          <p className="pw-page-subtitle">
            Ranked by how well each program fits your preferences
            {activeProfileName && <> for <strong>{activeProfileName}</strong></>}.
          </p>
        </div>
        <Link to="/preferences" className="btn btn-outline-secondary btn-sm">Switch Profile</Link>
      </div>
      {recs.length === 0 && <div className="pw-empty-state pw-card">No matching programs found. Try adjusting your preferences.</div>}

      {recs.map((rec, index) => (
        <div className="pw-card p-4 mb-3" key={rec.program.id}>
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <div className="text-muted small mb-1">#{index + 1} Recommended</div>
              <h5 className="mb-1">{rec.program.title}</h5>
              <div className="text-muted small">
                {rec.program.university_name} &middot; {rec.program.provider_name} &middot; {rec.program.category_name}
              </div>
            </div>
            <MatchBadge percent={rec.matchPercent} />
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <div className="fw-semibold small mb-1">Why this program matches you</div>
              {rec.reasonsMatched.length === 0 ? (
                <div className="text-muted small">No strong matches identified.</div>
              ) : (
                <ul className="list-unstyled small mb-0">
                  {rec.reasonsMatched.map((r) => <li key={r}>✓ {r}</li>)}
                </ul>
              )}
            </div>
            <div className="col-md-6">
              <div className="fw-semibold small mb-1">Things to consider</div>
              {rec.reasonsWarning.length === 0 ? (
                <div className="text-muted small">No major concerns.</div>
              ) : (
                <ul className="list-unstyled small mb-0 text-warning-emphasis">
                  {rec.reasonsWarning.map((r) => <li key={r}>⚠ {r}</li>)}
                </ul>
              )}
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <Link to={`/programs/${rec.program.id}`} className="btn btn-sm btn-outline-primary">View Details</Link>
            {savedIds.has(rec.program.id) ? (
              <span className="btn btn-sm btn-outline-secondary disabled">Saved</span>
            ) : (
              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleSave(rec.program.id)}>Save</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
