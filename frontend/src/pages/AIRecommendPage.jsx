// src/pages/AIRecommendPage.jsx — AI Recommendation Display Page (Q1 + Q5)
import { useEffect, useState } from 'react';
import { Sparkles, Users, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';

export default function AIRecommendPage() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [recommendation, setRecommendation] = useState('');
  const [rankResult, setRankResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [ranking, setRanking] = useState(false);
  const [fetchingEmp, setFetchingEmp] = useState(true);

  useEffect(() => {
    API.get('/employees').then(({ data }) => {
      setEmployees(data.data || []);
      setFetchingEmp(false);
    }).catch(() => setFetchingEmp(false));
  }, []);

  const toggle = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleRecommend = async () => {
    if (selected.length === 0) { toast.error('Select at least one employee'); return; }
    setLoading(true);
    setRecommendation('');
    try {
      const { data } = await API.post('/ai/recommend', { employeeIds: selected });
      setRecommendation(data.data.recommendation);
      toast.success('AI recommendation generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRank = async () => {
    setRanking(true);
    setRankResult('');
    try {
      const { data } = await API.post('/ai/rank', {});
      setRankResult(data.data.ranking);
      toast.success('Employee ranking generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ranking failed');
    } finally {
      setRanking(false);
    }
  };

  const getLevel = (score) => score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low';

  return (
    <div className="page-container animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Recommendations</h1>
          <p className="page-subtitle">Powered by OpenRouter AI — promotion, training & ranking insights</p>
        </div>
        <button className="btn btn-success" onClick={handleRank} disabled={ranking}>
          {ranking ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <Trophy size={16} />}
          {ranking ? 'Ranking...' : 'Rank All Employees'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Employee Selection */}
        <div>
          <div className="card">
            <div className="flex items-center gap-1 mb-2">
              <Users size={18} color="var(--accent-blue)" />
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem' }}>
                Select Employees ({selected.length} selected)
              </h3>
            </div>

            {fetchingEmp ? (
              <div className="loading-overlay" style={{ padding: '2rem' }}><div className="spinner" /></div>
            ) : employees.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No employees available. Add employees first.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 400, overflowY: 'auto' }}>
                {employees.map(emp => (
                  <label key={emp._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.65rem 0.85rem', borderRadius: 10, cursor: 'pointer',
                    background: selected.includes(emp._id) ? 'rgba(137,180,250,0.08)' : 'var(--bg-surface1)',
                    border: `1px solid ${selected.includes(emp._id) ? 'var(--accent-blue)' : 'var(--border)'}`,
                    transition: 'all 0.2s' }}>
                    <input type="checkbox" checked={selected.includes(emp._id)} onChange={() => toggle(emp._id)}
                      style={{ accentColor: 'var(--accent-blue)', width: 16, height: 16 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.88rem' }}>{emp.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{emp.department} • {emp.performanceScore}%</p>
                    </div>
                    <span className={`badge badge-${getLevel(emp.performanceScore)}`}>
                      {getLevel(emp.performanceScore)}
                    </span>
                  </label>
                ))}
              </div>
            )}

            <button id="ai-recommend-btn" className="btn btn-primary w-full mt-2" onClick={handleRecommend} disabled={loading || selected.length === 0}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <Sparkles size={16} />}
              {loading ? 'Generating...' : 'Generate AI Recommendation'}
            </button>
          </div>
        </div>

        {/* AI Output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Recommendation Output */}
          <div className="ai-panel">
            <div className="flex items-center gap-1 mb-2">
              <Sparkles size={18} color="var(--accent-purple)" />
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--accent-purple)' }}>
                AI Recommendation
              </h3>
            </div>
            {loading ? (
              <div className="loading-overlay" style={{ padding: '2rem' }}>
                <div className="spinner" />
                <p className="animate-pulse">Analyzing employee data...</p>
              </div>
            ) : recommendation ? (
              <div className="ai-response">{recommendation}</div>
            ) : (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <Sparkles size={40} color="var(--accent-purple)" style={{ opacity: 0.3, margin: '0 auto 0.75rem' }} />
                <p>Select employees and click Generate to get AI-powered insights</p>
              </div>
            )}
          </div>

          {/* Ranking Output */}
          {rankResult && (
            <div className="ai-panel" style={{ borderColor: 'rgba(249,226,175,0.25)', background: 'linear-gradient(135deg, rgba(249,226,175,0.06), rgba(137,180,250,0.06))' }}>
              <div className="flex items-center gap-1 mb-2">
                <Trophy size={18} color="var(--accent-yellow)" />
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--accent-yellow)' }}>
                  Employee Rankings
                </h3>
              </div>
              <div className="ai-response">{rankResult}</div>
            </div>
          )}
        </div>
      </div>

      {/* AI Features Info */}
      <div className="card mt-3">
        <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>
          AI Features Available
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
          {[
            { icon: '🏆', title: 'Promotion Recommendation', desc: 'AI suggests eligible employees for promotion' },
            { icon: '📊', title: 'Employee Ranking', desc: 'Ranked list of all employees by AI analysis' },
            { icon: '📚', title: 'Training Suggestions', desc: 'Skills gap analysis and learning recommendations' },
            { icon: '💡', title: 'AI Feedback Generation', desc: 'Constructive feedback for performance improvement' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: 'var(--bg-surface1)', borderRadius: 10, padding: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{icon}</div>
              <p style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.25rem' }}>{title}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
