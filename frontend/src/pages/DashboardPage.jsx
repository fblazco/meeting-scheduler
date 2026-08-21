import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Bell, RefreshCw } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useSchedule from '../hooks/useSchedule';
import ScheduleList from '../components/schedule/ScheduleList';
import CreateScheduleModal from '../components/schedule/CreateScheduleModal';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { schedules, loading, error, fetchMySchedules } = useSchedule();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchMySchedules();
  }, [fetchMySchedules]);

  // Aggregate statistics
  const totalSchedules = schedules.length;
  const activeSchedules = schedules.filter((s) => s.isActive).length;
  const totalOpenSlots = schedules.reduce(
    (acc, s) => acc + (s.timeSlots?.filter((slot) => !slot.isBooked).length || 0),
    0
  );
  const totalPendingRequests = schedules.reduce(
    (acc, s) => acc + (s.bookings?.filter((b) => b.status === 'pending').length || 0),
    0
  );

  return (
    <div className="dashboard-page">
      {/* Header & Action */}
      <div className="page-header">
        <div>
          <h1>Welcome back, {user?.name || 'Tutor'} 👋</h1>
          <p>Manage your office hours, available booking intervals, and student meeting requests.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={fetchMySchedules}
            disabled={loading}
          >
            Refresh
          </Button>

          <Button
            icon={Plus}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Schedule
          </Button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}
      >
        <Card style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Calendars
              </p>
              <h2 style={{ marginTop: '0.25rem', fontSize: '1.8rem' }}>
                {activeSchedules} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {totalSchedules}</span>
              </h2>
            </div>
            <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <Calendar size={22} color="var(--primary)" />
            </div>
          </div>
        </Card>

        <Card style={{ borderLeft: '4px solid var(--secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Available Slots
              </p>
              <h2 style={{ marginTop: '0.25rem', fontSize: '1.8rem' }}>{totalOpenSlots}</h2>
            </div>
            <div style={{ background: 'var(--secondary-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <Clock size={22} color="var(--secondary)" />
            </div>
          </div>
        </Card>

        <Card style={{ borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pending Requests
              </p>
              <h2 style={{ marginTop: '0.25rem', fontSize: '1.8rem', color: totalPendingRequests > 0 ? '#fbbf24' : 'inherit' }}>
                {totalPendingRequests}
              </h2>
            </div>
            <div style={{ background: 'var(--warning-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <Bell size={22} color="var(--warning)" />
            </div>
          </div>
        </Card>
      </div>

      {/* Error state */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Schedules List Section */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Your Scheduling Spaces</h2>
        {loading && schedules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading your schedules...
          </div>
        ) : (
          <ScheduleList
            schedules={schedules}
            onOpenCreateModal={() => setCreateModalOpen(true)}
          />
        )}
      </div>

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchMySchedules}
      />
    </div>
  );
};

export default DashboardPage;
