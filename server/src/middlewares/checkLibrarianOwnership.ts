import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { getLibraryById } from '../repositories/libraryRepository';
import { asyncHandler } from '../utils/asyncHandler';

export const checkLibrarianOwnership = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const libraryId = req.params.libraryId;
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, 'Authentication required');
  }

  const library = await getLibraryById(libraryId);
  
  if (!library) {
    throw new ApiError(404, 'Library not found');
  }

  // Check if the user is a librarian of this library
  const isLibrarian = library.librarians.some(
    librarianId => librarianId.toString() === userId
  );

  if (!isLibrarian) {
    throw new ApiError(403, 'You are not authorized to manage this library');
  }

  next();
}); 