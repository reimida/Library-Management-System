import { Request, Response } from 'express';
import * as scheduleService from '../services/scheduleService';
import { asyncHandler } from '../utils/asyncHandler';
import { validateAndExecute, sendSuccess, validateId, executeWithValidation } from '../utils/controllerUtils';
import { scheduleSchema, updateScheduleSchema } from '../validations/scheduleSchemas';

export const createSchedule = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  
  return validateAndExecute(
    req, 
    res, 
    scheduleSchema, 
    async (data) => {
      validateId(libraryId, 'library');
      const schedule = await scheduleService.createSchedule(libraryId, data);
      return sendSuccess(res, schedule, 'Schedule created successfully', 201);
    }
  );
});

export const getSchedule = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  
  return executeWithValidation(
    req,
    res,
    () => {
      // Validation logic
      validateId(libraryId, 'library');
    },
    async () => {
      // Handler logic
      const schedule = await scheduleService.getScheduleByLibraryId(libraryId);
      return sendSuccess(res, schedule);
    }
  );
});

export const updateSchedule = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  
  return validateAndExecute(
    req, 
    res, 
    updateScheduleSchema, 
    async (data) => {
      validateId(libraryId, 'library');
      const updatedSchedule = await scheduleService.updateSchedule(libraryId, data);
      return sendSuccess(res, updatedSchedule, 'Schedule updated successfully');
    }
  );
});

export const deleteSchedule = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  
  return executeWithValidation(
    req,
    res,
    () => {
      // Validation logic
      validateId(libraryId, 'library');
    },
    async () => {
      // Handler logic
      await scheduleService.deleteSchedule(libraryId);
      return sendSuccess(res, null, "Schedule deleted successfully", 204);
    }
  );
}); 