import { Request, Response, NextFunction } from 'express';
import { BusinessError } from '../utils/errors';
import { getLibraryById } from '../repositories/libraryRepository';
import { asyncHandler } from '../utils/asyncHandler';
import { getUserById } from '../repositories/userRepository';
import { checkLibrarianAccess } from '../services/userService';

export const checkLibrarianOwnership = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { libraryId } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new BusinessError('Authentication required');
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