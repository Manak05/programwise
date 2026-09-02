import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const EMPTY_FORM = {
  title: '', university_id: '', provider_id: '', category_id: '', description: '',
  fee: '', currency: 'INR', duration_months: '', delivery_mode: 'Online',
  experience_level: 'Beginner', prerequisites: '', outcomes: '', career_goal_ids: []
};

export default function AdminProgramForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [universities, setUniversities] = useState([]);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [careerGoals, setCareerGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLookups() {
      const [uRes, pRes, cRes, gRes] = await Promise.all([
        api.get('/universities'), api.get('/providers'), api.get('/categories'), api.get('/career-goals')
      ]);
      setUniversities(uRes.data);
      setProviders(pRes.data);
      setCategories(cRes.data);
      setCareerGoals(gRes.data);

      if (isEdit) {
        const progRes = await api.get(`/programs/${id}`);
        const p = progRes.data;
        setForm({
          title: p.title, university_id: p.university_id, provider_id: p.provider_id,
          category_id: p.category_id, description: p.description || '', fee: p.fee,
          currency: p.currency, duration_months: p.duration_months, delivery_mode: p.delivery_mode,
          experience_level: p.experience_level, prerequisites: p.prerequisites || '',
          outcomes: p.outcomes || '', career_goal_ids: p.career_goals.map((g) => g.id)
        });
      } else if (uRes.data[0] && pRes.data[0] && cRes.data[0]) {
        setForm((f) => ({ ...f, university_id: uRes.data[0].id, provider_id: pRes.data[0].id, category_id: cRes.data[0].id }));
      }
      setLoading(false);
    }
    loadLookups().catch(() => { setError('Failed to load form data.'); setLoading(false); });
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleGoal = (goalId) => {
    setForm((f) => {
      const has = f.career_goal_ids.includes(goalId);
      return { ...f, career_goal_ids: has ? f.career_goal_ids.filter((g) => g !== goalId) : [...f.career_goal_ids, goalId] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await api.put(`/programs/${id}`, form);
      } else {
        await api.post('/programs', form);
      }
      navigate('/admin/programs');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save program.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading form..." />;

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <div className="pw-page-header">
        <h1 className="pw-page-title">{isEdit ? 'Edit Program' : 'Add Program'}</h1>
        <p className="pw-page-subtitle">{isEdit ? 'Update program details.' : 'Add a new program to the catalog.'}</p>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="pw-card p-4">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
        </div>

        <div className="row g-2">
          <div className="col-md-4 mb-3">
            <label className="form-label">University</label>
            <select className="form-select" name="university_id" value={form.university_id} onChange={handleChange} required>
              {universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Provider</label>
            <select className="form-select" name="provider_id" value={form.provider_id} onChange={handleChange} required>
              {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Category</label>
            <select className="form-select" name="category_id" value={form.category_id} onChange={handleChange} required>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="description" rows="2" value={form.description} onChange={handleChange} />
        </div>

        <div className="row g-2">
          <div className="col-md-4 mb-3">
            <label className="form-label">Fee (INR)</label>
            <input type="number" className="form-control" name="fee" value={form.fee} onChange={handleChange} required min="0" />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Duration (months)</label>
            <input type="number" className="form-control" name="duration_months" value={form.duration_months} onChange={handleChange} required min="1" />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Delivery Mode</label>
            <select className="form-select" name="delivery_mode" value={form.delivery_mode} onChange={handleChange}>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Experience Level</label>
          <select className="form-select" name="experience_level" value={form.experience_level} onChange={handleChange}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Experienced">Experienced</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Prerequisites</label>
          <textarea className="form-control" name="prerequisites" rows="2" value={form.prerequisites} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Outcomes</label>
          <textarea className="form-control" name="outcomes" rows="2" value={form.outcomes} onChange={handleChange} />
        </div>

        <div className="mb-4">
          <label className="form-label d-block">Related Career Goals</label>
          {careerGoals.map((g) => (
            <div className="form-check form-check-inline" key={g.id}>
              <input
                className="form-check-input" type="checkbox" id={`goal-${g.id}`}
                checked={form.career_goal_ids.includes(g.id)} onChange={() => toggleGoal(g.id)}
              />
              <label className="form-check-label" htmlFor={`goal-${g.id}`}>{g.name}</label>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Update Program' : 'Create Program'}
        </button>
      </form>
    </div>
  );
}
