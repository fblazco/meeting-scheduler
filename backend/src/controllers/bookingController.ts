import { Response, NextFunction } from 'express';
import BookingService from '../services/bookingService';
import { AuthRequest } from '../types';

export class BookingController {
  /**
   * POST /api/bookings (Public or Optional Auth)
   */
  public static async createBooking(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id || null;
      const booking = await BookingService.createBooking({
        ...req.body,
        userId,
      });

      res.status(201).json({
        success: true,
        message: 'Booking request submitted successfully.',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/bookings/schedule/:scheduleId (Owner only)
   */
  public static async getScheduleBookings(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ownerId = req.user!.id;
      const { scheduleId } = req.params;
      const bookings = await BookingService.getScheduleBookings(scheduleId, ownerId);

      res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/bookings/:id/status (Owner accepts/rejects)
   */
  public static async updateBookingStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ownerId = req.user!.id;
      const { id } = req.params;
      const { status } = req.body;

      const updated = await BookingService.updateBookingStatus(id, ownerId, status);

      res.status(200).json({
        success: true,
        message: `Booking request marked as ${status}.`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/bookings/my-bookings (Logged-in user bookings)
   */
  public static async getMyBookings(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const bookings = await BookingService.getUserBookings(userId);

      res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/bookings/:id/cancel
   */
  public static async cancelBooking(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const requesterIdOrEmail = req.user?.id || req.body.email;
      const { id } = req.params;

      if (!requesterIdOrEmail) {
        res.status(400).json({
          success: false,
          message: 'User authentication or student email is required to cancel.',
        });
        return;
      }

      const result = await BookingService.cancelBooking(id, requesterIdOrEmail);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.booking,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default BookingController;
