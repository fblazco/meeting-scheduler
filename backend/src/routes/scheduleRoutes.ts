import { Router } from 'express';
import ScheduleController from '../controllers/scheduleController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Public route for students/attendees accessing the shared link
router.get('/public/:linkToken', ScheduleController.getPublicSchedule);

// Protected routes for Schedule Owner
router.post('/', authenticate, ScheduleController.createSchedule);
router.get('/my-schedules', authenticate, ScheduleController.getMySchedules);
router.get('/:id', authenticate, ScheduleController.getScheduleById);
router.put('/:id', authenticate, ScheduleController.updateSchedule);
router.delete('/:id', authenticate, ScheduleController.deleteSchedule);

// Slot sub-routes
router.post('/:id/slots', authenticate, ScheduleController.addTimeSlots);
router.delete('/slots/:slotId', authenticate, ScheduleController.deleteTimeSlot);

export default router;
