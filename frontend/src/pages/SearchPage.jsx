// src/pages/SearchPage.jsx — Search & Filter Section (Q1 requirement)
import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import EmployeeCard from '../components/EmployeeCard';

const DEPARTMENTS = ['', 'Development', 'Marketing', 'HR', 'Sales', 'Finance', 'Operations', 'Design', 'QA'];

export default function SearchPage() {
  const [filters, setFilters] = useState({ name: '', department: '', skill: '', minScore: '', maxScore: '' });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setFilters({ ...filters, [field]: e.target.value });

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const { data } = await API.get(`/employees/search?${params.toString()}`);
      setResults(data.data || []);
      setSearched(true);
    } catch {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ name: '', department: '', skill: '', minScore: '', maxScore: '' });
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="page-container animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">Search & Filter</h1>
          <p className="page-subtitle">Find employees by name, department, skills, or score</p>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="card mb-3">
        <form onSubmit={handleSearch}>
          <div className="form-grid">
            {/* Name Search */}
            <div className="form-group">
              <label className="form-label" htmlFor="search-name">Employee Name</label>
              <div className="search-bar" style={{ padding: '0.5rem 0.85rem' }}>
                <Search size={16} color="var(--text-muted)" />
                <input id="search-name" placeholder="Search by name..." value={filters.name} onChange={set('name')} />
              </div>
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label" htmlFor="search-dept">Department</label>
              <select id="search-dept" className="form-control" value={filters.department} onChange={set('department')}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d || 'All Departments'}</option>)}
              </select>
            </div>

            {/* Skill */}
            <div className="form-group">
              <label className="form-label" htmlFor="search-skill">Skill</label>
              <input id="search-skill" type="text" className="form-control" placeholder="e.g. React, MongoDB"
                value={filters.skill} onChange={set('skill')} />
            </div>

            {/* Score Range */}
            <div className="form-group">
              <label className="form-label" htmlFor="search-min">Min Score</label>
              <input id="search-min" type="number" className="form-control" placeholder="0" min={0} max={100}
                value={filters.minScore} onChange={set('minScore')} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="search-max">Max Score</label>
              <input id="search-max" type="number" className="form-control" placeholder="100" min={0} max={100}
                value={filters.maxScore} onChange={set('maxScore')} />
            </div>
          </div>

          <div className="flex gap-1 mt-2" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={clearFilters}>
              <X size={15} /> Clear
            </button>
            <button type="submit" id="search-btn" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <Filter size={15} />}
              {loading ? 'Searching...' : 'Search Employees'}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {searched && (
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {results.length === 0 ? 'No employees match your filters.' : `Found ${results.length} employee${results.length !== 1 ? 's' : ''}`}
          </p>
          <div className="employee-grid">
            {results.map(emp => <EmployeeCard key={emp._id} employee={emp} />)}
          </div>
        </div>
      )}
    </div>
  );
}
