import { Op } from 'sequelize';
import { Schedule, TimeSlot, Booking, User } from '../models';
import { generateLinkToken } from '../utils/helpers';

export interface CreateScheduleInput {
  title: string;
  description?: string;
  slotDuration?: number;
  slots?: Array<{
    startTime: string | Date;
    endTime: string | Date;
  }>;
}

export interface UpdateScheduleInput {
  title?: string;
  description?: string;
  slotDuration?: number;
  isActive?: boolean;
}

export class ScheduleService {
  /**
   * Creates a new schedule and optionally initial time slots.
   */
  public static async createSchedule(ownerId: string, input: CreateScheduleInput) {
    const { title, description, slotDuration = 30, slots } = input;

    if (!title || title.trim() === '') {
      const error: any = new Error('Schedule title is required.');
      error.statusCode = 400;
      throw error;
    }

    const linkToken = generateLinkToken();

    const schedule = await Schedule.create({
      ownerId,
      title: title.trim(),
      description: description ? description.trim() : null,
      linkToken,
      slotDuration: Number(slotDuration) || 30,
      isActive: true,
    });

    const scheduleId = schedule.getDataValue('id') || schedule.id;

    if (slots && Array.isArray(slots) && slots.length > 0) {
      const slotRecords = slots.map((slot) => ({
        scheduleId,
        startTime: new Date(slot.startTime),
        endTime: new Date(slot.endTime),
        isBooked: false,
      }));

      await TimeSlot.bulkCreate(slotRecords);
    }

    return this.getScheduleById(scheduleId, ownerId);
  }

  /**
   * Retrieves all schedules owned by a user.
   */
  public static async getUserSchedules(ownerId: string) {
    const schedules = await Schedule.findAll({
      where: { ownerId },
      include: [
        {
          model: TimeSlot,
          as: 'timeSlots',
          attributes: ['id', 'startTime', 'endTime', 'isBooked'],
        },
        {
          model: Booking,
          as: 'bookings',
          attributes: ['id', 'status', 'studentName', 'studentEmail', 'createdAt'],
        },
      ],
      order: [
        ['createdAt', 'DESC'],
        [{ model: TimeSlot, as: 'timeSlots' }, 'startTime', 'ASC'],
      ],
    });

    return schedules;
  }

  /**
   * Retrieves a single schedule by ID for its owner.
   */
  public static async getScheduleById(scheduleId: string, ownerId: string) {
    const schedule = await Schedule.findOne({
      where: { id: scheduleId, ownerId },
      include: [
        {
          model: TimeSlot,
          as: 'timeSlots',
          include: [
            {
              model: Booking,
              as: 'bookings',
            },
          ],
        },
        {
          model: Booking,
          as: 'bookings',
          include: [
            {
              model: TimeSlot,
              as: 'timeSlot',
              attributes: ['id', 'startTime', 'endTime'],
            },
          ],
        },
      ],
      order: [[{ model: TimeSlot, as: 'timeSlots' }, 'startTime', 'ASC']],
    });

    if (!schedule) {
      const error: any = new Error('Schedule not found or you do not have permission to view it.');
      error.statusCode = 404;
      throw error;
    }

    return schedule;
  }

  /**
   * Retrieves public schedule details by linkToken for attendees/students.
   */
  public static async getScheduleByLinkToken(linkToken: string) {
    const schedule = await Schedule.findOne({
      where: { linkToken, isActive: true },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: TimeSlot,
          as: 'timeSlots',
          where: {
            isBooked: false,
            startTime: {
              [Op.gte]: new Date(),
            },
          },
          required: false,
          attributes: ['id', 'startTime', 'endTime', 'isBooked'],
        },
      ],
      order: [[{ model: TimeSlot, as: 'timeSlots' }, 'startTime', 'ASC']],
    });

    if (!schedule) {
      const error: any = new Error('Schedule not found or is currently inactive.');
      error.statusCode = 404;
      throw error;
    }

    return schedule;
  }

  /**
   * Updates schedule settings (title, description, isActive).
   */
  public static async updateSchedule(
    scheduleId: string,
    ownerId: string,
    input: UpdateScheduleInput
  ) {
    const schedule = await Schedule.findOne({ where: { id: scheduleId, ownerId } });

    if (!schedule) {
      const error: any = new Error('Schedule not found or you do not have permission to edit it.');
      error.statusCode = 404;
      throw error;
    }

    if (input.title !== undefined) schedule.title = input.title.trim();
    if (input.description !== undefined) schedule.description = input.description?.trim() || null;
    if (input.slotDuration !== undefined) schedule.slotDuration = Number(input.slotDuration);
    if (input.isActive !== undefined) schedule.isActive = Boolean(input.isActive);

    await schedule.save();

    return schedule;
  }

  /**
   * Deletes a schedule and all related slots & bookings.
   */
  public static async deleteSchedule(scheduleId: string, ownerId: string) {
    const schedule = await Schedule.findOne({ where: { id: scheduleId, ownerId } });

    if (!schedule) {
      const error: any = new Error('Schedule not found or you do not have permission to delete it.');
      error.statusCode = 404;
      throw error;
    }

    await schedule.destroy();
    return { message: 'Schedule deleted successfully.' };
  }

  /**
   * Adds new time slots to an existing schedule.
   */
  public static async addTimeSlots(
    scheduleId: string,
    ownerId: string,
    slots: Array<{ startTime: string | Date; endTime: string | Date }>
  ) {
    const schedule = await Schedule.findOne({ where: { id: scheduleId, ownerId } });

    if (!schedule) {
      const error: any = new Error('Schedule not found or you do not have permission to update it.');
      error.statusCode = 404;
      throw error;
    }

    if (!slots || !Array.isArray(slots) || slots.length === 0) {
      const error: any = new Error('Please provide at least one time slot.');
      error.statusCode = 400;
      throw error;
    }

    const targetScheduleId = schedule.getDataValue('id') || scheduleId;

    const slotRecords = slots.map((slot) => ({
      scheduleId: targetScheduleId,
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime),
      isBooked: false,
    }));

    const createdSlots = await TimeSlot.bulkCreate(slotRecords);
    return createdSlots;
  }

  /**
   * Deletes a single time slot.
   */
  public static async deleteTimeSlot(slotId: string, ownerId: string) {
    const slot = await TimeSlot.findByPk(slotId, {
      include: [{ model: Schedule, as: 'schedule' }],
    });

    if (!slot) {
      const error: any = new Error('Time slot not found.');
      error.statusCode = 404;
      throw error;
    }

    const schedule = (slot as any).schedule;
    if (!schedule || schedule.ownerId !== ownerId) {
      const error: any = new Error('You do not have permission to delete this time slot.');
      error.statusCode = 403;
      throw error;
    }

    await slot.destroy();
    return { message: 'Time slot deleted successfully.' };
  }
}

export default ScheduleService;
