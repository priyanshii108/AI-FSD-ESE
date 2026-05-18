// src/components/EmployeeCard.jsx — Reusable employee card
import { Trash2, Edit2, Sparkles } from 'lucide-react';

const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const ScoreBar = ({ score }) => {
  const cls = score >= 80 ? 'score-high' : score >= 50 ? 'score-medium' : 'score-low';
  return (
    <div className="score-bar-container">
      <div className="score-bar" style={{ flex: 1 }}>
        <div className={`score-fill ${cls}`} style={{ width: `${score}%` }} />
      </div>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: 36,
        color: score >= 80 ? 'var(--accent-green)' : score >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
        {score}%
      </span>
    </div>
  );
};

export default function EmployeeCard({ employee, onDelete, onEdit, onAI, selected, onSelect }) {
  const level = employee.performanceScore >= 80 ? 'high' : employee.performanceScore >= 50 ? 'medium' : 'low';

  return (
    <div className="employee-card" style={{ border: selected ? '1px solid var(--accent-blue)' : undefined }}>
      {/* Header */}
      <div className="flex items-center gap-2" style={{ marginBottom: '1rem' }}>
        {onSelect && (
          <input type="checkbox" checked={selected} onChange={() => onSelect(employee._id)}
            style={{ width: 16, height: 16, accentColor: 'var(--accent-blue)', cursor: 'pointer', flexShrink: 0 }} />
        )}
        <div className="employee-avatar">{getInitials(employee.name)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="employee-name truncate">{employee.name}</p>
          <p className="employee-email truncate">{employee.email}</p>
        </div>
        <span className={`badge badge-${level}`}>
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </span>
      </div>

      {/* Info Row */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
        <span className="badge badge-blue">{employee.department}</span>
        <span className="badge badge-purple">{employee.experience} yrs exp</span>
      </div>

      {/* Performance Score */}
      <div style={{ marginBottom: '0.85rem' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
          PERFORMANCE SCORE
        </p>
        <ScoreBar score={employee.performanceScore} />
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.1rem' }}>
        {employee.skills?.slice(0, 4).map(skill => (
          <span key={skill} className="skill-tag">{skill}</span>
        ))}
        {employee.skills?.length > 4 && (
          <span className="skill-tag" style={{ color: 'var(--text-muted)' }}>+{employee.skills.length - 4}</span>
        )}
      </div>

      {/* AI Recommendation preview */}
      {employee.aiRecommendation && (
        <div style={{ background: 'rgba(203,166,247,0.08)', border: '1px solid rgba(203,166,247,0.2)',
          borderRadius: 8, padding: '0.6rem 0.75rem', marginBottom: '0.85rem', fontSize: '0.78rem',
          color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>✦ AI: </span>
          {employee.aiRecommendation.slice(0, 100)}...
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-1" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.85rem' }}>
        {onAI && (
          <button className="btn btn-success btn-sm" title="Get AI Recommendation" onClick={() => onAI(employee)}>
            <Sparkles size={13} /> AI
          </button>
        )}
        {onEdit && (
          <button className="btn btn-secondary btn-sm" onClick={() => onEdit(employee)}>
            <Edit2 size={13} /> Edit
          </button>
        )}
        {onDelete && (
          <button className="btn btn-danger btn-sm" style={{ marginLeft: 'auto' }} onClick={() => onDelete(employee._id)}>
            <Trash2 size={13} /> Delete
          </button>
        )}
      </div>
    </div>
  );
}
