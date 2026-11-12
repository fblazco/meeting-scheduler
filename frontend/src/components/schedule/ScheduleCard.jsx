import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, ArrowRight, Clock, Users, Calendar } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import ShareLinkModal from './ShareLinkModal';

export const ScheduleCard = ({ schedule }) => {
  const navigate = useNavigate();
  const [shareOpen, setShareOpen] = useState(false);

  const totalSlots = schedule.timeSlots?.length || 0;
  const availableSlots = schedule.timeSlots?.filter((s) => !s.isBooked).length || 0;
  const pendingBookings = schedule.bookings?.filter((b) => b.status === 'pending').length || 0;

  return (
    <>
      <Card
        className="schedule-card"
        onClick={() => navigate(`/schedule-detail/${schedule.id}`)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{schedule.title}</h3>
            {schedule.description ? (
              <p style={{ fontSize: '0.88rem', lineClamp: 2, overflow: 'hidden' }}>
                {schedule.description}
              </p>
            ) : (
              <p style={{ fontSize: '0.88rem', fontStyle: 'italic' }}>No description provided</p>
            )}
          </div>

          <span className={`badge ${schedule.isActive ? 'badge-active' : 'badge-rejected'}`}>
            {schedule.isActive ? 'Active' : 'Paused'}
          </span>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            padding: '0.75rem 0',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            margin: '1rem 0',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={15} color="var(--primary)" />
            <span>
              <strong style={{ color: 'var(--text-main)' }}>{availableSlots}</strong>/{totalSlots} open slots
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={15} color="var(--secondary)" />
            <span>{schedule.slotDuration} min</span>
          </div>

          {pendingBookings > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="badge badge-pending">
                {pendingBookings} {pendingBookings === 1 ? 'request' : 'requests'} waiting
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="secondary"
            size="sm"
            icon={Share2}
            onClick={() => setShareOpen(true)}
          >
            Share link
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={ArrowRight}
            onClick={() => navigate(`/schedule-detail/${schedule.id}`)}
          >
            Manage
          </Button>
        </div>
      </Card>

      <ShareLinkModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        schedule={schedule}
      />
    </>
  );
};

export default ScheduleCard;
