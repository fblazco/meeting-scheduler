import { Request, Response, NextFunction } from 'express';
import ScheduleService from '../services/scheduleService';
import { AuthRequest } from '../types';

export class ScheduleController {
  /**
   * POST /api/schedules
   */
  public static async createSchedule(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ownerId = req.user!.id;
      const schedule = await ScheduleService.createSchedule(ownerId, req.body);
      res.status(201).json({
        success: true,
        message: 'Schedule created successfully.',
        data: schedule,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/schedules/my-schedules
   */
  public static async getMySchedules(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ownerId = req.user!.id;
      const schedules = await ScheduleService.getUserSchedules(ownerId);
      res.status(200).json({
        success: true,
        data: schedules,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/schedules/:id
   */
  public static async getScheduleById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ownerId = req.user!.id;
      const { id } = req.params;
      const schedule = await ScheduleService.getScheduleById(id, ownerId);
      res.status(200).json({
        success: true,
        data: schedule,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/schedules/public/:linkToken (Public)
   */
  public static async getPublicSchedule(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { linkToken } = req.params;
      const schedule = await ScheduleService.getScheduleByLinkToken(linkToken);
      res.status(200).json({
        success: true,
        data: schedule,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/schedules/:id
   */
  public static async updateSchedule(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ownerId = req.user!.id;
      const { id } = req.params;
      const updated = await ScheduleService.updateSchedule(id, ownerId, req.body);
      res.status(200).json({
        success: true,
        message: 'Schedule updated successfully.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/schedules/:id
   */
  public static async deleteSchedule(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ownerId = req.user!.id;
      const { id } = req.params;
      const result = await ScheduleService.deleteSchedule(id, ownerId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/schedules/:id/slots
   */
  public static async addTimeSlots(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ownerId = req.user!.id;
      const { id } = req.params;
      const slots = await ScheduleService.addTimeSlots(id, ownerId, req.body.slots);
      res.status(201).json({
        success: true,
        message: 'Time slots added successfully.',
        data: slots,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/schedules/slots/:slotId
   */
  public static async deleteTimeSlot(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ownerId = req.user!.id;
      const { slotId } = req.params;
      const result = await ScheduleService.deleteTimeSlot(slotId, ownerId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ScheduleController;
