import { Request, Response } from 'express';
import { validateSeatInput, seatSchema, SeatStatus } from '../validations/seatSchemas';
import * as seatService from '../services/seatService';
import { asyncHandler } from '../utils/asyncHandler';
import { validateAndExecute, sendSuccess, validateId, executeWithValidation } from '../utils/controllerUtils';
import { z } from 'zod';
import { ConflictError } from '../utils/errors';

export const getAllSeats = asyncHandler(async (req: Request, res: Response) => {
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
      const seats = await seatService.getSeats(libraryId, {
        floor: req.query.floor as string,
        area: req.query.area as string
      });
      
      return sendSuccess(res, { seats });
    }
  );
});

export const getSeatById = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId, seatId } = req.params;
  
  return executeWithValidation(
    req,
    res,
    () => {
      // Validation logic
      validateId(libraryId, 'library');
      validateId(seatId, 'seat');
    },
    async () => {
      // Handler logic
      const seat = await seatService.getSeatById(libraryId, seatId);
      return sendSuccess(res, { data: seat });
    }
  );
});

export const createSeat = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  
  return validateAndExecute(
    req,
    res,
    seatSchema,
    async (seatData) => {
      validateId(libraryId, 'library');
      const seat = await seatService.createSeat(libraryId, {
        ...seatData,
        status: seatData.status ?? SeatStatus.AVAILABLE
      });
      return sendSuccess(res, seat, 'Seat created successfully', 201);
    }
  );
});

export const updateSeat = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId, seatId } = req.params;
  
  return validateAndExecute(
    req,
    res,
    seatSchema.partial(),
    async (seatData) => {
      validateId(libraryId, 'library');
      validateId(seatId, 'seat');
      const updatedSeat = await seatService.updateSeat(libraryId, seatId, seatData);
      return sendSuccess(res, updatedSeat, 'Seat updated successfully');
    }
  );
});

export const deleteSeat = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId, seatId } = req.params;
  
  return executeWithValidation(
    req,
    res,
    () => {
      // Validation logic
      validateId(libraryId, 'library');
      validateId(seatId, 'seat');
    },
    async () => {
      // Handler logic
      await seatService.deleteSeat(libraryId, seatId);
      return sendSuccess(res, null, 'Seat deleted successfully', 204);
    }
  );
}); 