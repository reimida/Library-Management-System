import { Request, Response } from 'express';
import { validateSeatInput, seatSchema, SeatStatus } from '../validations/seatSchemas';
import * as seatService from '../services/seatService';
import { asyncHandler } from '../utils/asyncHandler';
import { validateAndExecute, sendSuccess, validateId } from '../utils/controllerUtils';
import { z } from 'zod';
import { ConflictError } from '../utils/errors';

export const getAllSeats = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  validateId(libraryId, 'library');
  
  const seats = await seatService.getSeats(libraryId, {
    floor: req.query.floor as string,
    area: req.query.area as string
  });
  
  return sendSuccess(res, { seats });
});

export const getSeatById = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId, seatId } = req.params;
  validateId(libraryId, 'library');
  validateId(seatId, 'seat');
  
  const seat = await seatService.getSeatById(libraryId, seatId);
  return sendSuccess(res, { data: seat });
});

export const createSeat = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  validateId(libraryId, 'library');
  
  return validateAndExecute(
    req,
    res,
    seatSchema,
    async (seatData) => {
      try {
        const seat = await seatService.createSeat(libraryId, {
          ...seatData,
          status: seatData.status ?? SeatStatus.AVAILABLE
        });
        return sendSuccess(res, seat, 'Seat created successfully', 201);
      } catch (error) {
        if (error instanceof ConflictError) {
          res.status(409).json({ 
            success: false,
            errors: ['Seat code already exists in this library']
          });
          return null;
        }
        throw error;
      }
    }
  );
});

export const updateSeat = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId, seatId } = req.params;
  validateId(libraryId, 'library');
  validateId(seatId, 'seat');
  
  const seat = await validateAndExecute(
    req,
    res,
    seatSchema.partial(),
    async (seatData) => {
      return await seatService.updateSeat(libraryId, seatId, seatData);
    }
  );

  if (seat) {
    return sendSuccess(res, seat, 'Seat updated successfully');
  }
});

export const deleteSeat = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId, seatId } = req.params;
  validateId(libraryId, 'library');
  validateId(seatId, 'seat');
  
  await seatService.deleteSeat(libraryId, seatId);
  
  return sendSuccess(res, null, 'Seat deleted successfully', 204);
}); 