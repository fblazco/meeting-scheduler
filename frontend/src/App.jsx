import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/common/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ScheduleDetailPage from './pages/ScheduleDetailPage';
import PublicBookingPage from './pages/PublicBookingPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Authenticating session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export function App() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Root Route */}
          <Route
            path="/"
            element={
              loading ? (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                  Loading TutorSync...
                </div>
              ) : isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Owner & User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule-detail/:id"
            element={
              <ProtectedRoute>
                <ScheduleDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Public Student Booking Route */}
          <Route path="/schedule/:linkToken" element={<PublicBookingPage />} />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
