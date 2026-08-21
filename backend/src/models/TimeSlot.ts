import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface TimeSlotAttributes {
  id: string;
  scheduleId: string;
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TimeSlotCreationAttributes
  extends Optional<TimeSlotAttributes, 'id' | 'isBooked' | 'createdAt' | 'updatedAt'> {}

export class TimeSlot
  extends Model<TimeSlotAttributes, TimeSlotCreationAttributes>
  implements TimeSlotAttributes
{
  declare id: string;
  declare scheduleId: string;
  declare startTime: Date;
  declare endTime: Date;
  declare isBooked: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

TimeSlot.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isBooked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'time_slots',
    timestamps: true,
  }
);

export default TimeSlot;
