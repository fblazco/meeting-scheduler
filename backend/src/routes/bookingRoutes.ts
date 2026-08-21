import { Router } from 'express';
import BookingController from '../controllers/bookingController';
import { authenticate, optionalAuthenticate } from '../middlewares/authMiddleware';

const router = Router();

// Public / Optional-auth booking creation (students can book with or without account)
router.post('/', optionalAuthenticate, BookingController.createBooking);

// Protected routes for Schedule Owner
router.get('/schedule/:scheduleId', authenticate, BookingController.getScheduleBookings);
router.patch('/:id/status', authenticate, BookingController.updateBookingStatus);

// Protected routes for Attendee
router.get('/my-bookings', authenticate, BookingController.getMyBookings);

// Cancellation route (accessible to authenticated users or via email in body)
router.patch('/:id/cancel', optionalAuthenticate, BookingController.cancelBooking);

export default router;
