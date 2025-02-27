import { Request, Response, NextFunction } from 'express';
import { BusinessError } from '../utils/errors';
import { getLibraryById } from '../repositories/libraryRepository';
import { asyncHandler } from '../utils/asyncHandler';
import { getUserById } from '../repositories/userRepository';
import { checkLibrarianAccess } from '../services/userService';
import { SeatRepository } from '../repositories/seatRepository';

const seatRepository = new SeatRepository();

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
      const seat = await seatRepository.findById("", seatId);
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

  const user = await getUserById(userId);
  if (!user) {
    throw new BusinessError('User not found');
  }

  if (user.role === 'admin') {
    return next();
  }

  const isLibrarian = await checkLibrarianAccess(userId, libraryId);
  if (!isLibrarian) {
    throw new BusinessError('Not authorized to manage this library');
  }

  next();
}); 