import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const CAREER_GOALS = [
  'Data Scientist', 'AI Engineer', 'Full Stack Developer',
  'Cybersecurity Analyst', 'Business Analyst', 'Product Manager',
  'Cloud Engineer', 'Data Analyst'
];
const BUDGETS = ['Under ₹50,000', '₹50,000–₹1,00,000', '₹1,00,000–₹2,00,000', 'Above ₹2,00,000'];
const HOURS = ['5 hours/week', '10 hours/week', '15 hours/week', '20+ hours/week'];
const EXPERIENCE = ['Beginner', 'Intermediate', 'Experienced'];
const DELIVERY = ['Online', 'Hybrid'];
const DURATIONS = ['Under 6 months', '6–12 months', '12–18 months', '18+ months'];

const EMPTY_FORM = {
  profile_name: '',
  career_goal: CAREER_GOALS[0],
  budget: BUDGETS[0],
  available_hours: HOURS[0],
  experience_level: EXPERIENCE[0],
  delivery_preference: DELIVERY[0],
  preferred_duration: DURATIONS[1]
};

export default function Preferences() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null); // null = creating a new profile
  const [form, setForm] = useState(EMPTY_FORM);
  const formRef = React.useRef(null);

  const loadProfiles = () => {
    setLoading(true);
    api.get('/preferences')
      .then((res) => setProfiles(res.data))
      .catch(() => setError('Could not load your preference profiles.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadProfiles, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startNewProfile = () => {
  setEditingId(null);
  setForm(EMPTY_FORM);
  setError('');
  setSuccess('');

  setTimeout(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 0);
};

  const startEditProfile = (profile) => {
    setEditingId(profile.id);
    setForm({
      profile_name: profile.profile_name,
      career_goal: profile.career_goal,
      budget: profile.budget,
      available_hours: profile.available_hours,
      experience_level: profile.experience_level,
      delivery_preference: profile.delivery_preference,
      preferred_duration: profile.preferred_duration
    });
    setError('');
    setSuccess('');
    setTimeout(() => {
  formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (editingId) {
  await api.put(`/preferences/${editingId}`, form);
  setSuccess('Profile updated.');
} else {
  await api.post('/preferences', form);
  setSuccess('Profile created.');
}

setEditingId(null);
setForm(EMPTY_FORM);
loadProfiles();
setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      await api.patch(`/preferences/${id}/activate`);
      loadProfiles();
    } catch (err) {
      setError('Could not switch active profile.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this preference profile? This cannot be undone.')) return;
    try {
      await api.delete(`/preferences/${id}`);
      if (editingId === id) startNewProfile();
      loadProfiles();
    } catch (err) {
      setError('Could not delete profile.');
    }
  };

  if (loading) return <LoadingSpinner label="Loading your preference profiles..." />;

  return (
    <div className="container py-4">
      <div className="pw-page-header">
        <h1 className="pw-page-title">Preference Profiles</h1>
        <p className="pw-page-subtitle">
          Create one profile per goal (for example "Data Science" or "Budget Friendly").
          Recommendations always use whichever profile is marked Active.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row g-4">
        <div className="col-md-5">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="pw-section-title mb-0">Your Profiles</h2>
            <button className="btn btn-sm btn-outline-primary" onClick={startNewProfile}>+ New Profile</button>
          </div>

          {profiles.length === 0 ? (
            <div className="pw-empty-state pw-card">
              <p className="mb-0">You haven't created a preference profile yet.</p>
            </div>
          ) : (
            profiles.map((p) => (
              <div className="pw-card p-3 mb-2" key={p.id}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="fw-semibold">{p.profile_name}</div>
                    <div className="text-muted small">{p.career_goal} &middot; {p.budget}</div>
                  </div>
                  {p.is_active ? (
                    <span className="pw-badge pw-badge-status-active">Active</span>
                  ) : (
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleActivate(p.id)}>Select</button>
                  )}
                </div>
                <div className="d-flex gap-2 mt-2">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => startEditProfile(p)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </div>
            ))
          )}

          {profiles.some((p) => p.is_active) && (
            <Link to="/recommendations" className="btn btn-primary btn-sm mt-2">
              See Recommendations for Active Profile
            </Link>
          )}
        </div>

        <div className="col-md-7">
          <h2 className="pw-section-title">{editingId ? 'Edit Profile' : 'New Profile'}</h2>
          <form ref={formRef} onSubmit={handleSubmit} className="pw-card p-4">
            <div className="mb-3">
              <label className="form-label">Profile Name</label>
              <input
                className="form-control" name="profile_name" value={form.profile_name}
                onChange={handleChange} placeholder="e.g. Data Science Career" required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Career Goal</label>
              <select className="form-select" name="career_goal" value={form.career_goal} onChange={handleChange}>
                {CAREER_GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Budget</label>
              <select className="form-select" name="budget" value={form.budget} onChange={handleChange}>
                {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Available Study Time</label>
              <select className="form-select" name="available_hours" value={form.available_hours} onChange={handleChange}>
                {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Experience Level</label>
              <select className="form-select" name="experience_level" value={form.experience_level} onChange={handleChange}>
                {EXPERIENCE.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Delivery Preference</label>
              <select className="form-select" name="delivery_preference" value={form.delivery_preference} onChange={handleChange}>
                {DELIVERY.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label">Preferred Duration</label>
              <select className="form-select" name="preferred_duration" value={form.preferred_duration} onChange={handleChange}>
                {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Profile' : 'Create Profile'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline-secondary" onClick={startNewProfile}>Cancel</button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}