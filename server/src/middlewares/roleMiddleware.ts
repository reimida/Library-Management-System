import { Request, Response, NextFunction } from 'express';
import { BusinessError } from '../utils/errors';
import { Role } from '../types/auth';

export const authorize = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role;

      if (!userRole || !allowedRoles.includes(userRole as Role)) {
        throw new BusinessError('Not authorized to perform this action');
      }

      next();
    } catch (error) {
      if (error instanceof BusinessError) {
        return res.status(403).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}; 