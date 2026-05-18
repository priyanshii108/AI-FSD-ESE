// src/pages/AddEmployeePage.jsx — Employee Registration Form (Q1)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const DEPARTMENTS = ['Development', 'Marketing', 'HR', 'Sales', 'Finance', 'Operations', 'Design', 'QA'];

const initialForm = { name: '', email: '', department: 'Development', skills: [], performanceScore: '', experience: '' };

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setForm({ ...form, skills: form.skills.filter(s => s !== skill) });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email required';
    if (form.skills.length === 0) e.skills = 'Add at least one skill';
    if (form.performanceScore === '' || form.performanceScore < 0 || form.performanceScore > 100)
      e.performanceScore = 'Score must be between 0-100';
    if (form.experience === '' || form.experience < 0) e.experience = 'Experience must be ≥ 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await API.post('/employees', {
        ...form,
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience),
      });
      toast.success('Employee stored successfully ✓');
      setForm(initialForm);
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Employee</h1>
          <p className="page-subtitle">Register employee details in the system</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 800 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-name">Full Name *</label>
              <input id="emp-name" type="text" className="form-control" placeholder="Aman Verma"
                value={form.name} onChange={set('name')} />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-email">Email Address *</label>
              <input id="emp-email" type="email" className="form-control" placeholder="aman@gmail.com"
                value={form.email} onChange={set('email')} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-dept">Department *</label>
              <select id="emp-dept" className="form-control" value={form.department} onChange={set('department')}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Performance Score */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-score">Performance Score (0–100) *</label>
              <input id="emp-score" type="number" className="form-control" placeholder="85"
                min={0} max={100} value={form.performanceScore} onChange={set('performanceScore')} />
              {errors.performanceScore && <span className="form-error">{errors.performanceScore}</span>}
            </div>

            {/* Experience */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-exp">Years of Experience *</label>
              <input id="emp-exp" type="number" className="form-control" placeholder="3"
                min={0} value={form.experience} onChange={set('experience')} />
              {errors.experience && <span className="form-error">{errors.experience}</span>}
            </div>
          </div>

          {/* Skills */}
          <div className="form-group mt-2">
            <label className="form-label">Skills *</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input id="emp-skills" type="text" className="form-control" placeholder="Type a skill and press Add..."
                value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <button type="button" className="btn btn-secondary" onClick={addSkill}>
                <Plus size={16} /> Add
              </button>
            </div>
            {errors.skills && <span className="form-error">{errors.skills}</span>}
            {form.skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.65rem' }}>
                {form.skills.map(skill => (
                  <span key={skill} className="skill-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-red)',
                        display: 'flex', alignItems: 'center', padding: 0, lineHeight: 1 }}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sample preview */}
          {(form.name || form.email) && (
            <div style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)', borderRadius: 10,
              padding: '0.85rem 1rem', marginTop: '1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              <p style={{ color: 'var(--accent-blue)', marginBottom: '0.35rem', fontSize: '0.78rem' }}>// Sample Body Preview</p>
              {`{\n  "name": "${form.name}",\n  "email": "${form.email}",\n  "department": "${form.department}",\n  "skills": [${form.skills.map(s => `"${s}"`).join(', ')}],\n  "performanceScore": ${form.performanceScore || 0},\n  "experience": ${form.experience || 0}\n}`}
            </div>
          )}

          <div className="flex gap-1 mt-3" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/employees')}>Cancel</button>
            <button type="submit" id="add-employee-btn" className="btn btn-primary" disabled={submitting}>
              {submitting ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <UserPlus size={16} />}
              {submitting ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
