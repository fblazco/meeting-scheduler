import React, { useState } from 'react';
import { Check, X, Clock, Mail, MessageSquare, User, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import { formatDateTime } from '../../utils/helpers';
import { bookingService } from '../../services/bookingService';

export const BookingRequestsList = ({ bookings, onStatusChanged }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState('');

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    setActionError('');
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      if (onStatusChanged) onStatusChanged();
    } catch (err) {
      setActionError(err.message || `Failed to update status to ${newStatus}`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
        <Clock size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
        <p>No booking requests submitted yet for this schedule.</p>
      </div>
    );
  }

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const pastBookings = bookings.filter((b) => b.status !== 'pending');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {actionError && <div className="alert alert-danger">{actionError}</div>}

      {/* Pending Section */}
      <div>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span className="badge badge-pending">{pendingBookings.length}</span>
          Pending requests
        </h4>

        {pendingBookings.length === 0 ? (
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
            No pending booking requests to review.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pendingBookings.map((booking) => {
              const isUpdating = updatingId === booking.id;

              return (
                <div
                  key={booking.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        <User size={16} color="var(--primary)" />
                        <span>{booking.studentName}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        <Mail size={14} />
                        <span>{booking.studentEmail}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-input)', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                      <Clock size={14} color="var(--secondary)" />
                      <span>{formatDateTime(booking.timeSlot?.startTime)}</span>
                    </div>
                  </div>

                  {booking.studentNotes && (
                    <div style={{ background: 'var(--bg-main)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', display: 'flex', gap: '0.4rem' }}>
                      <MessageSquare size={14} style={{ flexShrink: 0, marginTop: '2px', opacity: 0.6 }} />
                      <span style={{ color: 'var(--text-muted)' }}>"{booking.studentNotes}"</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={X}
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      icon={Check}
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(booking.id, 'accepted')}
                    >
                      {isUpdating ? 'Updating...' : 'Accept'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* History / Decisions Section */}
      {pastBookings.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '1rem' }}>
            History ({pastBookings.length})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pastBookings.map((b) => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)', marginRight: '0.5rem' }}>
                    {b.studentName}
                  </span>
                  <span style={{ color: 'var(--text-dim)' }}>
                    ({formatDateTime(b.timeSlot?.startTime)})
                  </span>
                </div>

                <span className={`badge badge-${b.status}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingRequestsList;
