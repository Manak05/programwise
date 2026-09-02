import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProgramDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/programs/${id}`);
        setProgram(res.data);

        if (user && user.role === 'student') {
          const savedRes = await api.get('/saved-programs');
          setIsSaved(savedRes.data.some((p) => p.id === Number(id)));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Program not found.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user]);

  const handleSave = async () => {
    if (!user) return navigate('/login');
    try {
      await api.post(`/saved-programs/${id}`);
      setIsSaved(true);
      setActionMsg('Program saved!');
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Could not save program.');
    }
  };

  const handleUnsave = async () => {
    try {
      await api.delete(`/saved-programs/${id}`);
      setIsSaved(false);
      setActionMsg('Removed from saved programs.');
    } catch (err) {
      setActionMsg('Could not remove saved program.');
    }
  };

  const addToCompare = () => {
    const stored = sessionStorage.getItem('pw_compare');
    const set = new Set(stored ? JSON.parse(stored) : []);
    if (set.size >= 3 && !set.has(program.id)) {
      alert('You can compare up to 3 programs at a time.');
      return;
    }
    set.add(program.id);
    sessionStorage.setItem('pw_compare', JSON.stringify([...set]));
    navigate(`/compare?ids=${[...set].join(',')}`);
  };

  if (loading) return <LoadingSpinner label="Loading program details..." />;
  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;
  if (!program) return null;

  const isAdmin = user?.role === 'admin';

  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      <div className="d-flex flex-wrap gap-1 mb-2">
        <span className="pw-badge pw-badge-category">{program.category_name}</span>
        {!program.is_active && <span className="pw-badge pw-badge-status-inactive">Inactive</span>}
      </div>
      <h1 className="pw-page-title mb-1">{program.title}</h1>
      <p className="pw-page-subtitle">
        {program.university_name} &middot; Offered via {program.provider_name}
      </p>

      {actionMsg && <div className="alert alert-info py-2">{actionMsg}</div>}

      <div className="pw-card p-4 mb-4">
        <div className="row g-3">
          <div className="col-md-3"><span className="pw-stat-label d-block mb-1">Fee</span>{program.currency} {Number(program.fee).toLocaleString('en-IN')}</div>
          <div className="col-md-3"><span className="pw-stat-label d-block mb-1">Duration</span>{program.duration_months} months</div>
          <div className="col-md-3"><span className="pw-stat-label d-block mb-1">Delivery</span>{program.delivery_mode}</div>
          <div className="col-md-3"><span className="pw-stat-label d-block mb-1">Experience</span>{program.experience_level}</div>
          <div className="col-12">
            <span className="pw-stat-label d-block mb-1">Career Goals</span>
            {program.career_goals.length ? program.career_goals.map((g) => g.name).join(', ') : 'Not specified.'}
          </div>
        </div>
      </div>

      <div className="pw-card p-4 mb-4">
        <h2 className="pw-section-title">Description</h2>
        <p>{program.description}</p>
        <h2 className="pw-section-title">Prerequisites</h2>
        <p>{program.prerequisites || 'None specified.'}</p>
        <h2 className="pw-section-title mb-2">Outcomes</h2>
        <p className="mb-0">{program.outcomes || 'Not specified.'}</p>
      </div>

      <div className="d-flex flex-wrap gap-2">
        {!isAdmin && (
          isSaved ? (
            <button className="btn btn-outline-danger" onClick={handleUnsave}>Unsave Program</button>
          ) : (
            <button className="btn btn-primary" onClick={handleSave}>Save Program</button>
          )
        )}
        <button className="btn btn-outline-secondary" onClick={addToCompare}>Add to Compare</button>
        <Link to="/explore" className="btn btn-outline-secondary">Back to Explore</Link>
      </div>
    </div>
  );
}
