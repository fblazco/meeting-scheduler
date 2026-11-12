import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, Sun, Moon, Palette, Save, CheckCircle2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import userService from '../services/userService';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { formatDate } from '../utils/helpers';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { isDark, setTheme, colorTheme, setColorTheme, availableColorThemes } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const getInitials = (nameStr) => {
    if (!nameStr) return 'U';
    return nameStr
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Name and email cannot be empty.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await userService.updateProfile({
        name: name.trim(),
        email: email.trim(),
      });

      if (updateUser) {
        updateUser({ name: res.name, email: res.email });
      }

      setSuccessMsg('Your profile details have been saved successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Profile Banner */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderTop: '4px solid var(--primary)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div
          className="user-avatar"
          style={{
            width: '72px',
            height: '72px',
            fontSize: '1.9rem',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {getInitials(name || user?.name)}
        </div>

        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>{name || user?.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={15} /> {email || user?.email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Shield size={15} color="var(--primary)" /> Role: <strong style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>{user?.role || 'User'}</strong>
            </span>
            {user?.createdAt && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={15} /> Joined {formatDate(user.createdAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Theme Customization & Basic Profile Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.75rem' }}>
        
        {/* 1. Theme & Appearance Customization */}
        <Card title="Appearance & Themes">
          <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Customize your interface color palette and toggle between dark and daylight bright modes.
          </p>

          {/* Mode Switcher Slider */}
          <div className="theme-switch-container">
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                Theme Mode
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {isDark ? 'Dark mode' : 'Light mode'}
              </div>
            </div>

            <div
              className="theme-switch-slider"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              role="button"
              tabIndex={0}
              title="Click to toggle between Dark and Light mode"
            >
              <div className="theme-switch-glider" />
              <div className={`theme-switch-option ${isDark ? 'active' : ''}`}>
                <Moon size={15} />
                <span>Dark</span>
              </div>
              <div className={`theme-switch-option ${!isDark ? 'active' : ''}`}>
                <Sun size={15} />
                <span>Light</span>
              </div>
            </div>
          </div>

          {/* Color Theme Palette */}
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <Palette size={16} color="var(--primary)" />
              Accent Color Palette
            </label>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Choose a signature accent color for buttons, badges, and headers:
            </p>

            <div className="color-swatches">
              {availableColorThemes.map((ct) => {
                const isSelected = colorTheme === ct.id;
                return (
                  <button
                    key={ct.id}
                    type="button"
                    className={`color-swatch-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => setColorTheme(ct.id)}
                  >
                    <span className="swatch-circle" style={{ background: ct.color }} />
                    <span>{ct.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* 2. Basic Information Form */}
        <Card title="Basic Information">
          <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Update your public display name and contact email address.
          </p>

          {successMsg && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input
                type="text"
                required
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Jane Foster"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <input
                type="text"
                readOnly
                disabled
                className="form-input"
                value={user?.role?.toUpperCase() || 'USER'}
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Assigned based on calendar host activities.
              </span>
            </div>

            <Button
              type="submit"
              disabled={saving}
              icon={Save}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </Card>

      </div>
    </div>
  );
};

export default ProfilePage;
