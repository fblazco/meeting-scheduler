import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, LayoutDashboard, LogOut, LogIn, UserPlus, Sun, Moon, User } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import Button from './Button';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Calendar size={20} />
          </div>
          <span>TutorSync</span>
        </Link>

        <nav className="navbar-links">
          {/* Quick Theme Toggle */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Bright Daylight Mode' : 'Switch to Dark Midnight Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>

              {/* Clickable Profile Badge */}
              <Link
                to="/profile"
                className={`nav-user-badge ${location.pathname === '/profile' ? 'active' : ''}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  border: location.pathname === '/profile' ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: location.pathname === '/profile' ? 'var(--primary-light)' : 'var(--bg-surface)',
                }}
                title="View & Edit Your Profile"
              >
                <div className="user-avatar">{getInitials(user?.name)}</div>
                <span style={{ fontWeight: 500 }}>{user?.name || user?.email}</span>
              </Link>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                icon={LogOut}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                <LogIn size={18} />
                <span>Sign In</span>
              </Link>

              <Link to="/login?mode=register">
                <Button size="sm" icon={UserPlus}>
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
