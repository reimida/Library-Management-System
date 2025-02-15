import { Request, Response, NextFunction } from 'express';
import { Role } from '../types/auth';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';

export const authorize = (allowedRoles: Role[]) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole as Role)) {
      throw new ApiError(403, 'Unauthorized');
    }

    next();
  });
}; 