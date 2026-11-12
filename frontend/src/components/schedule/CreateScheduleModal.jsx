import React, { useState } from 'react';
import { CalendarPlus, Clock, Grid, SlidersHorizontal, GraduationCap } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useSchedule } from '../../hooks/useSchedule';
import WeeklyScheduleGrid from './WeeklyScheduleGrid';

export const CreateScheduleModal = ({ isOpen, onClose, onSuccess }) => {
  const { createSchedule } = useSchedule();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slotDuration, setSlotDuration] = useState(30);
  const [fromTime, setFromTime] = useState('08:00');
  const [toTime, setToTime] = useState('18:00');
  const [generatedSlots, setGeneratedSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isUniSchedule = Number(slotDuration) === 70;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a schedule title.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await createSchedule({
        title: title.trim(),
        description: description.trim() || null,
        slotDuration: Number(slotDuration),
        slots: generatedSlots,
      });

      // Reset
      setTitle('');
      setDescription('');
      setGeneratedSlots([]);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create schedule.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Schedule" maxWidth="960px">
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Schedule Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Schedule Title *</label>
            <input
              type="text"
              required
              placeholder="e.g., Calculus I Tutoring, Thesis Advising"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Instructions (Optional)</label>
            <input
              type="text"
              placeholder="Room 204, Google Meet link, or student preparation instructions..."
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Grid Configuration Controls */}
        <div
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginTop: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.92rem' }}>
              <SlidersHorizontal size={16} color="var(--primary)" />
              <span>Schedule Slot Distribution & Format</span>
            </div>

            {isUniSchedule && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                }}
              >
                <GraduationCap size={13} /> Standard University Schedule Active
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isUniSchedule ? '1fr' : 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Slot Duration / Structure</label>
              <select
                className="form-select"
                value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes (1 Hour)</option>
                <option value={70}>University modules (1h 10m, lunch at 13:30)</option>
              </select>
            </div>

            {!isUniSchedule && (
              <>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Daily Start Time (From)</label>
                  <input
                    type="time"
                    className="form-input"
                    value={fromTime}
                    onChange={(e) => setFromTime(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Daily End Time (To)</label>
                  <input
                    type="time"
                    className="form-input"
                    value={toTime}
                    onChange={(e) => setToTime(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          {isUniSchedule && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Uses 9 standard University Academic Modules (<strong>08:20 to 21:20</strong>) with 10-minute breaks and an <strong>Almuerzo / Lunch Break</strong> between <strong>13:30 and 14:50</strong>.
            </div>
          )}
        </div>

        {/* Interactive Excel-like Weekly Schedule Grid */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: 0 }}>
              <Grid size={16} color="var(--primary)" />
              Weekly Schedule Grid (Click cells to open/close slots)
            </label>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Tip: Click column/row headers to batch-select
            </span>
          </div>

          <WeeklyScheduleGrid
            mode="creator"
            slotDuration={slotDuration}
            fromTime={fromTime}
            toTime={toTime}
            selectedSlots={generatedSlots}
            onChangeSelectedSlots={setGeneratedSlots}
          />
        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} icon={CalendarPlus}>
            {submitting ? 'Creating Schedule...' : `Create Schedule (${generatedSlots.length} Slots)`}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateScheduleModal;
