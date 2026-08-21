import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Trash2,
  Plus,
  Clock,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Calendar,
  Grid,
  List,
} from 'lucide-react';
import scheduleService from '../services/scheduleService';
import bookingService from '../services/bookingService';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ShareLinkModal from '../components/schedule/ShareLinkModal';
import BookingRequestsList from '../components/booking/BookingRequestsList';
import WeeklyScheduleGrid from '../components/schedule/WeeklyScheduleGrid';
import { formatDateTime, formatDate, formatTime } from '../utils/helpers';

export const ScheduleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareOpen, setShareOpen] = useState(false);

  // View Mode: 'grid' | 'list'
  const [viewMode, setViewMode] = useState('grid');

  // Add Slots via Interactive Grid state
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [newGridSlots, setNewGridSlots] = useState([]);
  const [addingSlots, setAddingSlots] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const scheduleData = await scheduleService.getScheduleById(id);
      setSchedule(scheduleData);

      const bookingsData = await bookingService.getScheduleBookings(id);
      setBookings(bookingsData);
    } catch (err) {
      setError(err.message || 'Failed to load schedule details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleActive = async () => {
    if (!schedule) return;
    try {
      const updated = await scheduleService.updateSchedule(id, {
        isActive: !schedule.isActive,
      });
      setSchedule((prev) => ({ ...prev, isActive: updated.isActive }));
    } catch (err) {
      setError(err.message || 'Failed to update schedule status.');
    }
  };

  const handleDeleteSchedule = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete this schedule? All associated slots and bookings will be permanently removed.'
      )
    ) {
      return;
    }
    try {
      await scheduleService.deleteSchedule(id);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to delete schedule.');
    }
  };

  const handleBatchSaveGridSlots = async () => {
    if (newGridSlots.length === 0) {
      alert('Please click on cells in the grid to select at least one slot.');
      return;
    }

    setAddingSlots(true);
    try {
      await scheduleService.addTimeSlots(id, newGridSlots);
      setNewGridSlots([]);
      setShowAddSlot(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to add slots.');
    } finally {
      setAddingSlots(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Delete this available time slot?')) return;
    try {
      await scheduleService.deleteTimeSlot(slotId);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete slot.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
        Loading schedule management console...
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div>
        <Button
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => navigate('/dashboard')}
          style={{ marginBottom: '1rem' }}
        >
          Back to Dashboard
        </Button>
        <div className="alert alert-danger">{error || 'Schedule not found.'}</div>
      </div>
    );
  }

  return (
    <div className="schedule-detail-page" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Navigation */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Button
          variant="secondary"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Schedule Header Banner */}
      <Card style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <h1>{schedule.title}</h1>
              <span className={`badge ${schedule.isActive ? 'badge-active' : 'badge-rejected'}`}>
                {schedule.isActive ? 'Accepting Bookings' : 'Paused'}
              </span>
            </div>
            <p style={{ maxWidth: '750px' }}>
              {schedule.description || 'No description provided.'}
            </p>
            <div
              style={{
                display: 'flex',
                gap: '1.25rem',
                marginTop: '0.75rem',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
              }}
            >
              <span>
                Meeting Duration: <strong>{schedule.slotDuration} mins</strong>
              </span>
              <span>
                Total Slots: <strong>{schedule.timeSlots?.length || 0}</strong>
              </span>
              <span>
                Pending Requests: <strong>{bookings.filter((b) => b.status === 'pending').length}</strong>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              icon={schedule.isActive ? PauseCircle : PlayCircle}
              onClick={handleToggleActive}
            >
              {schedule.isActive ? 'Pause Bookings' : 'Resume Bookings'}
            </Button>

            <Button
              variant="primary"
              icon={Share2}
              onClick={() => setShareOpen(true)}
            >
              Share Link
            </Button>

            <Button
              variant="danger"
              icon={Trash2}
              onClick={handleDeleteSchedule}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* Booking Requests & Approvals Section */}
      <Card title="Meeting Requests & Approvals" style={{ marginBottom: '2rem' }}>
        <BookingRequestsList bookings={bookings} onStatusChanged={loadData} />
      </Card>

      {/* Time Slots Management Card */}
      <Card
        title="Schedule Time Slots & Calendar Grid"
        action={
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {/* View Mode Toggle */}
            <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', padding: '2px', border: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                  color: viewMode === 'grid' ? 'white' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                <Grid size={14} /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                style={{
                  background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                  color: viewMode === 'list' ? 'white' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                <List size={14} /> List
              </button>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={() => setShowAddSlot(!showAddSlot)}
            >
              {showAddSlot ? 'Cancel Add' : 'Add More Slots'}
            </Button>
          </div>
        }
      >
        {/* Interactive Add Slot Grid (when expanded) */}
        {showAddSlot && (
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--primary)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-main)' }}>Click Grid Cells to Add Slots</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Selected slots ({newGridSlots.length}) will be added to your available calendar.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                disabled={addingSlots || newGridSlots.length === 0}
                onClick={handleBatchSaveGridSlots}
              >
                {addingSlots ? 'Saving Slots...' : `Save ${newGridSlots.length} Selected Slots`}
              </Button>
            </div>

            <WeeklyScheduleGrid
              mode="creator"
              slotDuration={schedule.slotDuration || 30}
              selectedSlots={newGridSlots}
              onChangeSelectedSlots={setNewGridSlots}
            />
          </div>
        )}

        {/* View Mode: Excel-like Weekly Grid */}
        {viewMode === 'grid' && (
          <div>
            <WeeklyScheduleGrid
              mode="viewer"
              slotDuration={schedule.slotDuration || 30}
              existingSlots={schedule.timeSlots || []}
              onDeleteSlot={handleDeleteSlot}
            />
          </div>
        )}

        {/* View Mode: List View */}
        {viewMode === 'list' && (
          <div>
            {schedule.timeSlots?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <Clock size={32} style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                <p>No time slots configured. Click "Add More Slots" above.</p>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  maxHeight: '480px',
                  overflowY: 'auto',
                  paddingRight: '0.25rem',
                }}
              >
                {schedule.timeSlots?.map((slot) => (
                  <div
                    key={slot.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.88rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        {formatDate(slot.startTime)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`badge ${slot.isBooked ? 'badge-accepted' : 'badge-active'}`}>
                        {slot.isBooked ? 'Booked' : 'Available'}
                      </span>

                      {!slot.isBooked && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSlot(slot.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#f87171',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex',
                          }}
                          title="Delete slot"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Share Modal */}
      <ShareLinkModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        schedule={schedule}
      />
    </div>
  );
};

export default ScheduleDetailPage;
