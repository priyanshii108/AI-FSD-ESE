// src/pages/DashboardPage.jsx — Analytics overview with stats and charts
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Award, Brain, Plus, Search } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
         BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const DEPT_COLORS = {
  Development: '#89b4fa', Marketing: '#cba6f7', HR: '#a6e3a1',
  Sales: '#f9e2af', Finance: '#94e2d5', Operations: '#f38ba8',
  Design: '#89dceb', QA: '#fab387',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/employees').then(({ data }) => {
      setEmployees(data.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const total = employees.length;
  const avgScore = total ? (employees.reduce((s, e) => s + e.performanceScore, 0) / total).toFixed(1) : 0;
  const topPerformers = employees.filter(e => e.performanceScore >= 80).length;

  // Dept distribution for bar chart
  const deptData = Object.entries(
    employees.reduce((acc, e) => { acc[e.department] = (acc[e.department] || 0) + 1; return acc; }, {})
  ).map(([dept, count]) => ({ dept, count }));

  // Top 5 employees
  const top5 = [...employees].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 5);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: 'var(--bg-surface1)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.5rem 0.75rem', fontSize: 13 }}>
          <p style={{ color: 'var(--text-primary)' }}>{payload[0].payload.dept}</p>
          <p style={{ color: 'var(--accent-blue)' }}>Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="page-container animate-fade">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">👋 Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="page-subtitle">Here's your employee analytics overview</p>
        </div>
        <div className="flex gap-1">
          <button className="btn btn-secondary" onClick={() => navigate('/search')}>
            <Search size={16} /> Search
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/employees/add')}>
            <Plus size={16} /> Add Employee
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {[
          { icon: Users, label: 'Total Employees', value: loading ? '—' : total, color: '#89b4fa', bg: 'rgba(137,180,250,0.12)' },
          { icon: TrendingUp, label: 'Average Score', value: loading ? '—' : `${avgScore}%`, color: '#a6e3a1', bg: 'rgba(166,227,161,0.12)' },
          { icon: Award, label: 'Top Performers', value: loading ? '—' : topPerformers, color: '#cba6f7', bg: 'rgba(203,166,247,0.12)' },
          { icon: Brain, label: 'Departments', value: loading ? '—' : deptData.length, color: '#f9e2af', bg: 'rgba(249,226,175,0.12)' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon" style={{ background: bg }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Bar Chart */}
        <div className="card">
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>
            Employees by Department
          </h3>
          {loading ? (
            <div className="loading-overlay" style={{ padding: '2rem' }}>
              <div className="spinner" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deptData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="dept" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#89b4fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Performers */}
        <div className="card">
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>
            Top 5 Performers
          </h3>
          {loading ? (
            <div className="loading-overlay" style={{ padding: '2rem' }}><div className="spinner" /></div>
          ) : top5.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>No employees yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {top5.map((emp, i) => (
                <div key={emp._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-surface2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-blue)', flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{emp.name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 600 }}>{emp.performanceScore}%</span>
                    </div>
                    <div className="score-bar">
                      <div className={`score-fill score-${emp.performanceScore >= 80 ? 'high' : emp.performanceScore >= 50 ? 'medium' : 'low'}`}
                        style={{ width: `${emp.performanceScore}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { label: 'View All Employees', path: '/employees', variant: 'btn-secondary' },
            { label: 'Add New Employee', path: '/employees/add', variant: 'btn-primary' },
            { label: 'Search Employees', path: '/search', variant: 'btn-secondary' },
            { label: 'AI Recommendations', path: '/ai-recommend', variant: 'btn-success' },
          ].map(({ label, path, variant }) => (
            <button key={path} className={`btn ${variant}`} onClick={() => navigate(path)}>{label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
