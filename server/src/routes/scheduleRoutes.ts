import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { Role } from '../types/auth';
import { checkLibrarianOwnership } from '../middlewares/checkLibrarianOwnership';
import {
    createSchedule,
    getSchedule,
    updateSchedule,
    deleteSchedule
} from '../controllers/scheduleController';
import { Request, Response, NextFunction } from 'express';

const router = Router({ mergeParams: true });

// Public route
router.get('/', getSchedule);

// Protected routes (Admin and Librarian)
router.put(
    '/',
    authenticate,
    authorize([Role.ADMIN, Role.LIBRARIAN]),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.user?.role === Role.ADMIN) return next();
      return checkLibrarianOwnership(req, res, next);
    },
    updateSchedule
);

router.post(
    "/",
    authenticate,
    authorize([Role.ADMIN]),
    createSchedule
);

router.delete(
    '/',
    authenticate,
    authorize([Role.ADMIN]),
    deleteSchedule
);

export default router; 