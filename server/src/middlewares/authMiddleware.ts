import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';

// Extend Express Request type to include user info
declare module 'express' {
  interface Request {
    user?: {
      userId: string;
      email: string;
      role: string;
    }
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
} 