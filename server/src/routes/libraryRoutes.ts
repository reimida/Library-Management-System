import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { Role } from '../types/auth';
import { checkLibrarianOwnership } from '../middlewares/checkLibrarianOwnership';
import {
  createLibrary,
  getLibrary,
  listLibraries,
  updateLibrary,
  deleteLibrary,
} from '../controllers/libraryController';

const router = Router();

// Public routes
router.get('/', listLibraries);
router.get('/:libraryId', getLibrary);

// Protected routes
router.patch('/:libraryId', 
  authenticate,
  authorize([Role.ADMIN, Role.LIBRARIAN]),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role === Role.ADMIN) return next();
    return checkLibrarianOwnership(req, res, next);
  },
  updateLibrary
);

// Admin routes
router.post('/', authenticate, authorize([Role.ADMIN]), createLibrary);
router.delete('/:libraryId', authenticate, authorize([Role.ADMIN]), deleteLibrary);
export default router; 