import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface BookingAttributes {
  id: string;
  timeSlotId: string;
  scheduleId: string;
  userId?: string | null;
  studentName: string;
  studentEmail: string;
  studentNotes?: string | null;
  status: BookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookingCreationAttributes
  extends Optional<
    BookingAttributes,
    'id' | 'userId' | 'studentNotes' | 'status' | 'createdAt' | 'updatedAt'
  > {}

export class Booking
  extends Model<BookingAttributes, BookingCreationAttributes>
  implements BookingAttributes
{
  declare id: string;
  declare timeSlotId: string;
  declare scheduleId: string;
  declare userId?: string | null;
  declare studentName: string;
  declare studentEmail: string;
  declare studentNotes?: string | null;
  declare status: BookingStatus;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    timeSlotId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'time_slots',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    scheduleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'schedules',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    studentName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    studentEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    studentNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'bookings',
    timestamps: true,
  }
);

export default Booking;
