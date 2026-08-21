import React from 'react';
import { CalendarPlus, Sparkles } from 'lucide-react';
import ScheduleCard from './ScheduleCard';
import Button from '../common/Button';

export const ScheduleList = ({ schedules, onOpenCreateModal }) => {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <Sparkles size={48} color="var(--primary)" />
        </div>
        <h3 style={{ marginBottom: '0.5rem' }}>No Schedules Created Yet</h3>
        <p style={{ maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
          Create your first scheduling space to define bookable hours, share your custom link, and start accepting meeting requests.
        </p>
        <Button icon={CalendarPlus} onClick={onOpenCreateModal}>
          Create First Schedule
        </Button>
      </div>
    );
  }

  return (
    <div className="grid-cards">
      {schedules.map((schedule) => (
        <ScheduleCard key={schedule.id} schedule={schedule} />
      ))}
    </div>
  );
};

export default ScheduleList;
