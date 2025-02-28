import { Request, Response, NextFunction } from 'express';
import { BusinessError } from '../utils/errors';
import { asyncHandler } from '../utils/asyncHandler';
import * as userService from '../services/userService';
import * as seatService from '../services/seatService';
import { Role } from '../types/auth';

export const checkLibrarianOwnership = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get libraryId from params or from the seat if seatId is provided
  let { libraryId } = req.params;
  const { seatId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new BusinessError('Authentication required');
  }

  // If we have a seatId but no libraryId, get the libraryId from the seat
  if (!libraryId && seatId) {
    try {
      // Use service layer to get seat information
      const seat = await seatService.getSeatById("", seatId);
      libraryId = seat.libraryId.toString();
    } catch (error) {
      // If seat not found, pass to the next middleware which will handle the 404
      return next();
    }
  }

  // If we still don't have a libraryId, we can't check ownership
  if (!libraryId) {
    throw new BusinessError('Library ID is required');
  }

  try {
    // Use service layer for user operations
    const user = await userService.getUserById(userId);
    
    // Admin bypass - admins can access any library
    if (user.role === Role.ADMIN) {
      return next();
    }

    // Check if the librarian has access to this specific library
    const hasAccess = await userService.checkLibrarianAccess(userId, libraryId);
    if (!hasAccess) {
      throw new BusinessError('Not authorized to manage this library');
    }

    next();
  } catch (error) {
    if (error instanceof BusinessError) {
      throw error;
    }
    throw new BusinessError(error instanceof Error ? error.message : 'User not found');
  }
}); 