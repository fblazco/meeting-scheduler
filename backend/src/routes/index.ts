import { Router } from 'express';
import authRoutes from './authRoutes';
import scheduleRoutes from './scheduleRoutes';
import bookingRoutes from './bookingRoutes';
import userRoutes from './userRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'University Tutoring Scheduler API is healthy and operational.',
    timestamp: new Date().toISOString(),
  });
});

// Mount feature routes
router.use('/auth', authRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/bookings', bookingRoutes);
router.use('/users', userRoutes);

export default router;
