import { Router } from 'express';
import UserController from '../controllers/userController';
import { authenticate, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// Profile endpoints
router.get('/profile', authenticate, UserController.getProfile);
router.put('/profile', authenticate, UserController.updateProfile);

// Admin-only endpoints
router.get('/', authenticate, requireAdmin, UserController.getAllUsers);

export default router;
