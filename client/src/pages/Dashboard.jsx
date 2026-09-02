import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import MatchBadge from '../components/MatchBadge';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState(null);
  const [savedCount, setSavedCount] = useState(0);
  const [topRecommendations, setTopRecommendations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
        async function loadDashboard() {
      try {
        const [prefRes, savedRes] = await Promise.all([
          api.get('/preferences'),
          api.get('/saved-programs')
        ]);
        const activeProfile = prefRes.data.find((p) => p.is_active) || null;
        setPreferences(activeProfile);
        setSavedCount(savedRes.data.length);

        if (activeProfile) {
          const recRes = await api.post('/recommendations?limit=3');
          setTopRecommendations(recRes.data);
        }
      } catch (err) {
        setError('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) return <LoadingSpinner label="Loading your dashboard..." />;

   return (
    <div className="container py-4">
      <div className="pw-page-header">
        <h1 className="pw-page-title">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="pw-page-subtitle">Here's where things stand with your programs.</p>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="pw-card p-4 text-center">
            <div className="display-6 fw-bold text-primary">{savedCount}</div>
            <div className="text-muted">Saved Programs</div>
            <Link to="/saved" className="small">View saved →</Link>
          </div>
        </div>
                <div className="col-md-4">
          <div className="pw-card p-4">
            <div className="fw-bold mb-2">Active Profile</div>
            {preferences ? (
              <>
                <div className="small fw-semibold mb-1">{preferences.profile_name}</div>
                <ul className="list-unstyled small mb-0">
                  <li><strong>Goal:</strong> {preferences.career_goal}</li>
                  <li><strong>Budget:</strong> {preferences.budget}</li>
                  <li><strong>Experience:</strong> {preferences.experience_level}</li>
                  <li><strong>Delivery:</strong> {preferences.delivery_preference}</li>
                </ul>
              </>
            ) : (
              <div className="text-muted small">No preference profile yet.</div>
            )}
            <Link to="/preferences" className="small d-block mt-2">Manage profiles →</Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="pw-card p-4 d-flex flex-column justify-content-center">
            <div className="fw-bold mb-2">Quick Access</div>
            <Link to="/explore" className="btn btn-outline-primary btn-sm mb-2">Explore Programs</Link>
            <Link to="/recommendations" className="btn btn-outline-primary btn-sm">My Recommendations</Link>
          </div>
        </div>
      </div>

      <h5 className="pw-section-title">Top Recommendations for You</h5>
            {!preferences && (
        <div className="pw-empty-state pw-card">
          <p>Create a preference profile to get personalized recommendations.</p>
          <Link to="/preferences" className="btn btn-primary btn-sm">Create Profile</Link>
        </div>
      )}
      {preferences && topRecommendations.length === 0 && (
        <div className="pw-empty-state pw-card">No strong matches found yet.</div>
      )}
      <div className="row">
        {topRecommendations.map((rec) => (
          <div className="col-md-4 mb-3" key={rec.program.id}>
            <div className="pw-card p-3 h-100">
                            <div className="d-flex justify-content-between mb-2">
                <span className="pw-badge pw-badge-category">{rec.program.category_name}</span>
                <MatchBadge percent={rec.matchPercent} />
              </div>
              <h6>{rec.program.title}</h6>
              <div className="text-muted small mb-2">{rec.program.university_name}</div>
              <Link to={`/programs/${rec.program.id}`} className="btn btn-sm btn-outline-primary">View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
