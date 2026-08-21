import { Op } from 'sequelize';
import { Booking, TimeSlot, Schedule, User } from '../models';
import { BookingStatus } from '../models/Booking';

export interface CreateBookingInput {
  timeSlotId: string;
  studentName: string;
  studentEmail: string;
  studentNotes?: string;
  userId?: string | null;
}

export class BookingService {
  /**
   * Creates a meeting booking request for a given time slot.
   */
  public static async createBooking(input: CreateBookingInput) {
    const { timeSlotId, studentName, studentEmail, studentNotes, userId } = input;

    if (!timeSlotId || !studentName || !studentEmail) {
      const error: any = new Error('Time slot, student name, and student email are required.');
      error.statusCode = 400;
      throw error;
    }

    const slot = await TimeSlot.findByPk(timeSlotId, {
      include: [{ model: Schedule, as: 'schedule' }],
    });

    if (!slot) {
      const error: any = new Error('Selected time slot does not exist.');
      error.statusCode = 404;
      throw error;
    }

    if (slot.isBooked) {
      const error: any = new Error('This time slot is already booked and confirmed.');
      error.statusCode = 409;
      throw error;
    }

    const schedule = (slot as any).schedule;
    if (!schedule || !schedule.isActive) {
      const error: any = new Error('This schedule is currently not accepting new bookings.');
      error.statusCode = 400;
      throw error;
    }

    const slotId = slot.getDataValue('id') || slot.id;
    const scheduleId = schedule.getDataValue('id') || schedule.id;

    const booking = await Booking.create({
      timeSlotId: slotId,
      scheduleId: scheduleId,
      userId: userId || null,
      studentName: studentName.trim(),
      studentEmail: studentEmail.toLowerCase().trim(),
      studentNotes: studentNotes ? studentNotes.trim() : null,
      status: 'pending',
    });

    return booking;
  }

  /**
   * Retrieves all bookings for a schedule (Owner only).
   */
  public static async getScheduleBookings(scheduleId: string, ownerId: string) {
    const schedule = await Schedule.findOne({ where: { id: scheduleId, ownerId } });

    if (!schedule) {
      const error: any = new Error('Schedule not found or you do not have permission.');
      error.statusCode = 404;
      throw error;
    }

    const bookings = await Booking.findAll({
      where: { scheduleId },
      include: [
        {
          model: TimeSlot,
          as: 'timeSlot',
          attributes: ['id', 'startTime', 'endTime', 'isBooked'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return bookings;
  }

  /**
   * Accepts or rejects a booking request (Owner only).
   */
  public static async updateBookingStatus(
    bookingId: string,
    ownerId: string,
    status: 'accepted' | 'rejected'
  ) {
    if (!['accepted', 'rejected'].includes(status)) {
      const error: any = new Error("Invalid status. Allowed values are 'accepted' or 'rejected'.");
      error.statusCode = 400;
      throw error;
    }

    const booking = await Booking.findByPk(bookingId, {
      include: [
        { model: TimeSlot, as: 'timeSlot' },
        { model: Schedule, as: 'schedule' },
      ],
    });

    if (!booking) {
      const error: any = new Error('Booking request not found.');
      error.statusCode = 404;
      throw error;
    }

    const schedule = (booking as any).schedule;
    if (!schedule || schedule.ownerId !== ownerId) {
      const error: any = new Error('You do not have permission to manage this booking.');
      error.statusCode = 403;
      throw error;
    }

    const slot = (booking as any).timeSlot as TimeSlot;

    if (status === 'accepted') {
      booking.status = 'accepted';
      await booking.save();

      if (slot) {
        slot.isBooked = true;
        await slot.save();

        // Automatically reject competing pending bookings on the same slot
        await Booking.update(
          { status: 'rejected' },
          {
            where: {
              timeSlotId: slot.id,
              id: { [Op.ne]: booking.id },
              status: 'pending',
            },
          }
        );
      }
    } else if (status === 'rejected') {
      booking.status = 'rejected';
      await booking.save();

      // If slot was previously marked booked by this booking, release it
      if (slot && slot.isBooked) {
        slot.isBooked = false;
        await slot.save();
      }
    }

    return booking;
  }

  /**
   * Retrieves bookings made by a logged-in student/attendee.
   */
  public static async getUserBookings(userId: string) {
    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: TimeSlot,
          as: 'timeSlot',
          attributes: ['id', 'startTime', 'endTime'],
        },
        {
          model: Schedule,
          as: 'schedule',
          attributes: ['id', 'title', 'description', 'linkToken'],
          include: [
            {
              model: User,
              as: 'owner',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return bookings;
  }

  /**
   * Cancels a booking.
   */
  public static async cancelBooking(bookingId: string, requesterIdOrEmail: string) {
    const booking = await Booking.findByPk(bookingId, {
      include: [
        { model: TimeSlot, as: 'timeSlot' },
        { model: Schedule, as: 'schedule' },
      ],
    });

    if (!booking) {
      const error: any = new Error('Booking not found.');
      error.statusCode = 404;
      throw error;
    }

    const schedule = (booking as any).schedule;
    const isOwner = schedule && schedule.ownerId === requesterIdOrEmail;
    const isAttendee =
      booking.userId === requesterIdOrEmail ||
      booking.studentEmail.toLowerCase() === requesterIdOrEmail.toLowerCase();

    if (!isOwner && !isAttendee) {
      const error: any = new Error('You do not have permission to cancel this booking.');
      error.statusCode = 403;
      throw error;
    }

    booking.status = 'cancelled';
    await booking.save();

    const slot = (booking as any).timeSlot as TimeSlot;
    if (slot && slot.isBooked) {
      slot.isBooked = false;
      await slot.save();
    }

    return { message: 'Booking cancelled successfully.', booking };
  }
}

export default BookingService;
