// src/pages/EmployeesPage.jsx — Employee list with CRUD
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../api/axios';
import EmployeeCard from '../components/EmployeeCard';
import EditEmployeeModal from '../components/EditEmployeeModal';

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/employees');
      setEmployees(data.data || []);
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this employee?')) return;
    try {
      await API.delete(`/employees/${id}`);
      toast.success('Employee removed successfully');
      setEmployees(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleAI = async (employee) => {
    try {
      toast.loading('Generating AI recommendation...', { id: 'ai' });
      const { data } = await API.post('/ai/recommend', { employeeIds: [employee._id] });
      toast.success('AI recommendation generated!', { id: 'ai' });
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI request failed', { id: 'ai' });
    }
  };

  return (
    <div className="page-container animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">{employees.length} employees registered</p>
        </div>
        <div className="flex gap-1">
          <button className="btn btn-secondary" onClick={fetchEmployees}>
            <RefreshCw size={15} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/employees/add')}>
            <Plus size={16} /> Add Employee
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-overlay"><div className="spinner" /><p>Loading employees...</p></div>
      ) : employees.length === 0 ? (
        <div className="empty-state">
          <h3>No employees found</h3>
          <p>Add your first employee to get started</p>
          <button className="btn btn-primary mt-2" onClick={() => navigate('/employees/add')}>
            <Plus size={16} /> Add Employee
          </button>
        </div>
      ) : (
        <div className="employee-grid">
          {employees.map(emp => (
            <EmployeeCard
              key={emp._id}
              employee={emp}
              onDelete={handleDelete}
              onEdit={setEditTarget}
              onAI={handleAI}
            />
          ))}
        </div>
      )}

      {editTarget && (
        <EditEmployeeModal
          employee={editTarget}
          onClose={() => setEditTarget(null)}
          onUpdated={fetchEmployees}
        />
      )}
    </div>
  );
}
