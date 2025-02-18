import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Extend Express Request type to include user info
declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}

export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    throw new AuthError(401, 'No token provided');
  }

  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  req.user = decoded;
  next();
}); 