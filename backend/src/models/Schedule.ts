import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ScheduleAttributes {
  id: string;
  ownerId: string;
  title: string;
  description?: string | null;
  linkToken: string;
  slotDuration: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ScheduleCreationAttributes
  extends Optional<
    ScheduleAttributes,
    'id' | 'description' | 'slotDuration' | 'isActive' | 'createdAt' | 'updatedAt'
  > {}

export class Schedule
  extends Model<ScheduleAttributes, ScheduleCreationAttributes>
  implements ScheduleAttributes
{
  declare id: string;
  declare ownerId: string;
  declare title: string;
  declare description?: string | null;
  declare linkToken: string;
  declare slotDuration: number;
  declare isActive: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Schedule.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    linkToken: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    slotDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'schedules',
    timestamps: true,
  }
);

export default Schedule;
