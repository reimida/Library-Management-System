import { Request, Response } from 'express';
import { validateSeatInput, seatSchema, SeatStatus } from '../validations/seatSchemas';
import * as seatService from '../services/seatService';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import { validateAndExecute } from '../utils/controllerUtils';
import { z } from 'zod';

export const getAllSeats = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  const { floor, area } = req.query;
  
  const seats = await seatService.getSeats(libraryId, {
    floor: floor as string,
    area: area as string
  });
  
  res.json({
    success: true,
    data: seats
  });
});

export const getSeatById = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId, seatId } = req.params;
  
  const seat = await seatService.getSeatById(libraryId, seatId);
  if (!seat) throw new ApiError(404, 'Seat not found');
  
  res.json({
    success: true,
    data: seat
  });
});

export const createSeat = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  
  return validateAndExecute(
    req,
    res,
    seatSchema,
    async (seatData) => {
      const seat = await seatService.createSeat(libraryId, {
        ...seatData,
        status: seatData.status ?? SeatStatus.AVAILABLE
      });
      return {
        success: true,
        data: seat
      };
    },
    201
  );
});

export const updateSeat = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId, seatId } = req.params;
  
  return validateAndExecute(
    req,
    res,
    seatSchema.partial(),
    async (seatData) => {
      const seat = await seatService.updateSeat(libraryId, seatId, seatData);
      if (!seat) throw new ApiError(404, 'Seat not found');
      return {
        success: true,
        data: seat
      };
    }
  );
});

export const deleteSeat = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId, seatId } = req.params;
  
  await seatService.deleteSeat(libraryId, seatId);
  
  res.status(204).json({
    success: true,
    message: 'Seat deleted successfully'
  });
}); 