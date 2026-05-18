// src/components/EditEmployeeModal.jsx — Edit employee modal
import { useState } from 'react';
import { X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

const DEPARTMENTS = ['Development', 'Marketing', 'HR', 'Sales', 'Finance', 'Operations', 'Design', 'QA'];

export default function EditEmployeeModal({ employee, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: employee.name,
    email: employee.email,
    department: employee.department,
    skills: employee.skills.join(', '),
    performanceScore: employee.performanceScore,
    experience: employee.experience,
  });
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        performanceScore: Number(form.performanceScore), experience: Number(form.experience) };
      await API.put(`/employees/${employee._id}`, payload);
      toast.success('Updated data shown ✓');
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Employee</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {[
              { id: 'edit-name', label: 'Full Name', field: 'name', type: 'text' },
              { id: 'edit-email', label: 'Email', field: 'email', type: 'email' },
              { id: 'edit-score', label: 'Performance Score (0-100)', field: 'performanceScore', type: 'number' },
              { id: 'edit-exp', label: 'Years of Experience', field: 'experience', type: 'number' },
            ].map(({ id, label, field, type }) => (
              <div className="form-group" key={field}>
                <label className="form-label" htmlFor={id}>{label}</label>
                <input id={id} type={type} className="form-control" value={form[field]} onChange={set(field)} />
              </div>
            ))}

            <div className="form-group">
              <label className="form-label" htmlFor="edit-dept">Department</label>
              <select id="edit-dept" className="form-control" value={form.department} onChange={set('department')}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="edit-skills">Skills (comma-separated)</label>
              <input id="edit-skills" type="text" className="form-control" value={form.skills} onChange={set('skills')} placeholder="React, Node.js, MongoDB" />
            </div>
          </div>

          <div className="flex gap-1 mt-3" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <Save size={15} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
