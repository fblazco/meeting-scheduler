import React, { useState, useMemo } from 'react';
import { Calendar, Clock, CheckCircle2, Grid, List } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/helpers';
import WeeklyScheduleGrid from '../schedule/WeeklyScheduleGrid';

export const BookingSlotPicker = ({ slots, selectedSlot, onSelectSlot }) => {
  const [pickerView, setPickerView] = useState('grid'); // 'grid' | 'list'

  // Group slots by date for list view
  const groupedSlots = useMemo(() => {
    if (!slots || slots.length === 0) return {};

    const groups = {};
    slots.forEach((slot) => {
      const dateKey = new Date(slot.startTime).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(slot);
    });

    return groups;
  }, [slots]);

  const dates = Object.keys(groupedSlots);
  const [selectedDate, setSelectedDate] = useState(dates[0] || '');

  React.useEffect(() => {
    if (dates.length > 0 && !dates.includes(selectedDate)) {
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate]);

  if (slots.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
        <Clock size={32} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
        <p>No available slots are currently open for booking on this schedule.</p>
      </div>
    );
  }

  const activeDateSlots = groupedSlots[selectedDate] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & View Mode Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: 0 }}>
          <Clock size={16} color="var(--primary)" />
          Choose an Available Time Slot
        </label>

        <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', padding: '2px', border: '1px solid var(--border)' }}>
          <button
            type="button"
            onClick={() => setPickerView('grid')}
            style={{
              background: pickerView === 'grid' ? 'var(--primary)' : 'transparent',
              color: pickerView === 'grid' ? 'white' : 'var(--text-muted)',
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
            <Grid size={13} /> Weekly Grid
          </button>
          <button
            type="button"
            onClick={() => setPickerView('list')}
            style={{
              background: pickerView === 'list' ? 'var(--primary)' : 'transparent',
              color: pickerView === 'list' ? 'white' : 'var(--text-muted)',
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
            <List size={13} /> Day Tabs
          </button>
        </div>
      </div>

      {/* 1. Excel-like Weekly Grid View */}
      {pickerView === 'grid' && (
        <WeeklyScheduleGrid
          mode="booker"
          existingSlots={slots}
          selectedSlot={selectedSlot}
          onSelectSlot={onSelectSlot}
        />
      )}

      {/* 2. Day Tabs & Buttons View */}
      {pickerView === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Date Tabs */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {dates.map((dateStr) => {
                const isSelected = dateStr === selectedDate;
                const count = groupedSlots[dateStr]?.filter((s) => !s.isBooked).length || 0;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(dateStr)}
                    style={{
                      background: isSelected ? 'var(--primary)' : 'var(--bg-surface)',
                      color: isSelected ? 'white' : 'var(--text-main)',
                      border: isSelected ? '1px solid var(--primary-hover)' : '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.6rem 0.9rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'var(--transition)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: '100px',
                    }}
                  >
                    <span>{formatDate(dateStr)}</span>
                    <span style={{ fontSize: '0.75rem', opacity: isSelected ? 0.9 : 0.6, marginTop: '2px' }}>
                      {count} available
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slot Buttons for selected date */}
          <div className="slot-grid">
            {activeDateSlots.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              const isBooked = slot.isBooked;

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isBooked}
                  className={`slot-button ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                  onClick={() => onSelectSlot(slot)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                    {isSelected && <CheckCircle2 size={13} />}
                    <span>{formatTime(slot.startTime)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSlotPicker;
