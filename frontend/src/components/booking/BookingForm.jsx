import React, { useState } from 'react';
import { Send, CheckCircle2, Clock, Calendar } from 'lucide-react';
import Button from '../common/Button';
import { bookingService } from '../../services/bookingService';
import { formatDateTime } from '../../utils/helpers';
import useAuth from '../../hooks/useAuth';

export const BookingForm = ({ slot, schedule, onSuccess }) => {
  const { user } = useAuth();

  const [studentName, setStudentName] = useState(user?.name || '');
  const [studentEmail, setStudentEmail] = useState(user?.email || '');
  const [studentNotes, setStudentNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slot) {
      setError('Please select a time slot first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await bookingService.createBooking({
        timeSlotId: slot.id,
        studentName: studentName.trim(),
        studentEmail: studentEmail.trim(),
        studentNotes: studentNotes.trim() || null,
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to submit booking request.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>
          <CheckCircle2 size={54} style={{ margin: '0 auto' }} />
        </div>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Booking Request Sent!</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem' }}>
          Your request for <strong>{formatDateTime(slot?.startTime)}</strong> has been sent to the host. You will receive an update once they accept your meeting.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setSubmitted(false);
            setStudentNotes('');
          }}
        >
          Book Another Slot
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Selected Slot Summary Badge */}
      {slot && (
        <div
          style={{
            background: 'var(--primary-light)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <Clock size={20} color="var(--primary)" />
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
              Selected Time
            </span>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
              {formatDateTime(slot.startTime)}
            </div>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Your Name *</label>
        <input
          type="text"
          required
          placeholder="e.g. Alex Johnson"
          className="form-input"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Your Email *</label>
        <input
          type="email"
          required
          placeholder="e.g. alex@university.edu"
          className="form-input"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Meeting Topic / Questions (Optional)</label>
        <textarea
          placeholder="What would you like to discuss during this session?"
          className="form-textarea"
          value={studentNotes}
          onChange={(e) => setStudentNotes(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        disabled={loading || !slot}
        icon={Send}
        style={{ marginTop: '0.5rem' }}
      >
        {loading ? 'Submitting Request...' : 'Confirm & Request Booking'}
      </Button>
    </form>
  );
};

export default BookingForm;
