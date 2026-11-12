import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, CheckCircle, ShieldCheck } from 'lucide-react';
import scheduleService from '../services/scheduleService';
import BookingSlotPicker from '../components/booking/BookingSlotPicker';
import BookingForm from '../components/booking/BookingForm';
import Card from '../components/common/Card';

export const PublicBookingPage = () => {
  const { linkToken } = useParams();
  const formSectionRef = useRef(null);

  const [schedule, setSchedule] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSchedule = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await scheduleService.getPublicSchedule(linkToken);
      setSchedule(data);
    } catch (err) {
      setError(err.message || 'Unable to load schedule. It may have expired or been made inactive.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, [linkToken]);

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    // Smooth scroll down to booking form when a slot is selected
    if (formSectionRef.current) {
      setTimeout(() => {
        formSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading scheduling calendar...
      </div>
    );
  }

  if (error || !schedule) {
    return (
      <div style={{ maxWidth: '540px', margin: '4rem auto', textAlign: 'center' }}>
        <Card>
          <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>
            <Calendar size={48} style={{ margin: '0 auto' }} />
          </div>
          <h2>Schedule unavailable</h2>
          <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/" className="btn btn-secondary">
            Go to Homepage
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '1rem 0' }}>
      {/* Host & Schedule Header Banner */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderTop: '4px solid var(--primary)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div className="user-avatar" style={{ width: '38px', height: '38px', fontSize: '1rem' }}>
            {schedule.owner?.name ? schedule.owner.name[0] : 'T'}
          </div>
          <div>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Office hours with
            </span>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
              {schedule.owner?.name} ({schedule.owner?.email})
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: '2.6rem', marginBottom: '0.5rem' }}>{schedule.title}</h1>
        {schedule.description && (
          <p style={{ fontSize: '1rem', color: 'var(--text-main)', opacity: 0.9, maxWidth: '800px' }}>
            {schedule.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', fontSize: '0.88rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
            <Clock size={16} color="var(--primary)" />
            <span>{schedule.slotDuration} min session</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} color="var(--success)" />
            <span>Confirmation required by host</span>
          </div>
        </div>
      </div>

      {/* Stacked Vertical Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* 1. Full-Width Available Time Windows (Grid on Top) */}
        <Card title="Available Time Windows">
          <BookingSlotPicker
            slots={schedule.timeSlots || []}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSelectSlot}
          />
        </Card>

        {/* 2. Full-Width Your Booking Details (Form Below) */}
        <div ref={formSectionRef}>
          <Card title="Your Booking Details">
            {selectedSlot ? (
              <BookingForm
                slot={selectedSlot}
                schedule={schedule}
                onSuccess={() => {
                  setSelectedSlot(null);
                  loadSchedule();
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                <Calendar size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                <p style={{ fontSize: '0.95rem' }}>
                  Please click an available time slot in the grid above to complete your meeting reservation details.
                </p>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
};

export default PublicBookingPage;
