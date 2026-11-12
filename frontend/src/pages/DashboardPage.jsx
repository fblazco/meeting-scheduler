import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
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
          <h1>Welcome back, {user?.name || 'Tutor'}</h1>
          <p style={{ marginTop: '0.35rem' }}>Your office hours, open times and student requests.</p>
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
            New schedule
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
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.88rem' }}>
                Active schedules
              </p>
              <h2 style={{ marginTop: '0.25rem', fontSize: '2.2rem', fontFamily: 'var(--font-heading)' }}>
                {activeSchedules} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {totalSchedules}</span>
              </h2>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.88rem' }}>
                Open time slots
              </p>
              <h2 style={{ marginTop: '0.25rem', fontSize: '2.2rem', fontFamily: 'var(--font-heading)' }}>{totalOpenSlots}</h2>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.88rem' }}>
                Requests awaiting reply
              </p>
              <h2 style={{ marginTop: '0.25rem', fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: totalPendingRequests > 0 ? 'var(--warning-text)' : 'inherit' }}>
                {totalPendingRequests}
              </h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Error state */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Schedules List Section */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Your schedules</h2>
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
