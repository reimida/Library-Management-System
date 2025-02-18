import { Request, Response, NextFunction } from 'express';
import { BusinessError } from '../utils/errors';
import { Role } from '../types/auth';
import { asyncHandler } from '../utils/asyncHandler';

export const authorize = (allowedRoles: Role[]) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole as Role)) {
      throw new BusinessError('Not authorized to perform this action');
    }

    next();
  });
}; 