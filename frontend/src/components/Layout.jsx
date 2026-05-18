// src/components/Layout.jsx — Sidebar + main layout wrapper
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, UserPlus, Search, Sparkles, LogOut, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/employees/add', icon: UserPlus, label: 'Add Employee' },
  { to: '/search', icon: Search, label: 'Search & Filter' },
  { to: '/ai-recommend', icon: Sparkles, label: 'AI Recommendations' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="flex items-center gap-1" style={{ gap: '0.6rem' }}>
            <BrainCircuit size={22} color="#89b4fa" />
            <div>
              <h2>EmpAnalytics</h2>
              <p>AI-Powered HR System</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ marginBottom: '0.75rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role?.toUpperCase()}</p>
          </div>
          <button className="btn btn-secondary btn-sm w-full" onClick={handleLogout}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
