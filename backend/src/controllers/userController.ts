import { Response, NextFunction } from 'express';
import { User } from '../models';
import { AuthRequest } from '../types';
import { hashPassword } from '../utils/helpers';

export class UserController {
  /**
   * GET /api/users/profile
   */
  public static async getProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await User.findByPk(req.user!.id, {
        attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
      });

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/profile
   */
  public static async updateProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await User.findByPk(req.user!.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      const { name, email } = req.body;
      if (name && name.trim()) {
        user.name = name.trim();
      }

      if (email && email.trim()) {
        const lowerEmail = email.toLowerCase().trim();
        const existing = await User.findOne({ where: { email: lowerEmail } });
        if (existing && existing.id !== user.id) {
          const err: any = new Error('Email is already in use by another account.');
          err.statusCode = 409;
          throw err;
        }
        user.email = lowerEmail;
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users (Admin only)
   */
  public static async getAllUsers(
    _req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'createdAt'],
        order: [['createdAt', 'DESC']],
      });

      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
