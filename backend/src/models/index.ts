import sequelize from '../config/database';
import User from './User';
import Schedule from './Schedule';
import TimeSlot from './TimeSlot';
import Booking from './Booking';

// ==========================================
// Model Relationships & Associations
// ==========================================

// 1. User <-> Schedule (Owner creates schedules)
User.hasMany(Schedule, {
  foreignKey: 'ownerId',
  as: 'schedules',
  onDelete: 'CASCADE',
});
Schedule.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner',
});

// 2. Schedule <-> TimeSlot (Schedule contains time slots)
Schedule.hasMany(TimeSlot, {
  foreignKey: 'scheduleId',
  as: 'timeSlots',
  onDelete: 'CASCADE',
});
TimeSlot.belongsTo(Schedule, {
  foreignKey: 'scheduleId',
  as: 'schedule',
});

// 3. TimeSlot <-> Booking (Time slot has booking requests)
TimeSlot.hasMany(Booking, {
  foreignKey: 'timeSlotId',
  as: 'bookings',
  onDelete: 'CASCADE',
});
Booking.belongsTo(TimeSlot, {
  foreignKey: 'timeSlotId',
  as: 'timeSlot',
});

// 4. Schedule <-> Booking (Schedule has bookings for fast lookup)
Schedule.hasMany(Booking, {
  foreignKey: 'scheduleId',
  as: 'bookings',
  onDelete: 'CASCADE',
});
Booking.belongsTo(Schedule, {
  foreignKey: 'scheduleId',
  as: 'schedule',
});

// 5. User <-> Booking (Optional: if the person booking is a registered user)
User.hasMany(Booking, {
  foreignKey: 'userId',
  as: 'userBookings',
  onDelete: 'SET NULL',
});
Booking.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export {
  sequelize,
  User,
  Schedule,
  TimeSlot,
  Booking,
};

export default {
  sequelize,
  User,
  Schedule,
  TimeSlot,
  Booking,
};
