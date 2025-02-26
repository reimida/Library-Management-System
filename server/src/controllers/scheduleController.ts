import { Request, Response } from 'express';
import * as scheduleService from '../services/scheduleService';
import { asyncHandler } from '../utils/asyncHandler';
import { validateAndExecute, sendSuccess, validateId } from '../utils/controllerUtils';
import { scheduleSchema, updateScheduleSchema } from '../validations/scheduleSchemas';

export const createSchedule = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  validateId(libraryId, 'library');

  return validateAndExecute(req, res, scheduleSchema, async (data) => {
      const schedule = await scheduleService.createSchedule(libraryId, data);
      return sendSuccess(res, schedule, 'Schedule created successfully', 201);
  });
});

export const getSchedule = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  validateId(libraryId, 'library');

  const schedule = await scheduleService.getScheduleByLibraryId(libraryId);
  return sendSuccess(res, schedule);
});

export const updateSchedule = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  validateId(libraryId, 'library');
  return validateAndExecute(req, res, updateScheduleSchema, async(data) => {
      const updatedSchedule = await scheduleService.updateSchedule(libraryId, data);
      return sendSuccess(res, updatedSchedule, 'Schedule updated successfully');
  });
});

export const deleteSchedule = asyncHandler(async (req: Request, res: Response) => {
    const { libraryId } = req.params;
    validateId(libraryId, "library");

    await scheduleService.deleteSchedule(libraryId);
    return sendSuccess(res, null, "Schedule deleted successfully", 204);
}); 