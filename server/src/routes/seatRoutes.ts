import express, { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { checkLibrarianOwnership } from '../middlewares/checkLibrarianOwnership';
import { Role } from '../types/auth';
import * as seatController from '../controllers/seatController';
import { seatReservationRouter } from './reservationRoutes';

// mergeParams allows access to libraryId from parent router
const router = express.Router({ mergeParams: true });

/**PUBLIC ENDPOINTS */
// GET /libraries/:libraryId/seats
router.get(
  '/',
  seatController.getAllSeats
);

// GET /libraries/:libraryId/seats/:seatId  
router.get(
  '/:seatId',
  seatController.getSeatById
);

/**ADMIN AND LIBRARIAN ENDPOINTS */
// POST /libraries/:libraryId/seats
router.post(
  '/',
  authenticate,
  authorize([Role.ADMIN, Role.LIBRARIAN]),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role === Role.ADMIN) return next();
    return checkLibrarianOwnership(req, res, next);
  },
  seatController.createSeat
);

// PUT /libraries/:libraryId/seats/:seatId
router.put(
  '/:seatId',
  authenticate,
  authorize([Role.ADMIN, Role.LIBRARIAN]),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role === Role.ADMIN) return next();
    return checkLibrarianOwnership(req, res, next);
  },
  seatController.updateSeat
);

// DELETE /libraries/:libraryId/seats/:seatId
router.delete(
  '/:seatId',
  authenticate,
  authorize([Role.ADMIN, Role.LIBRARIAN]),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role === Role.ADMIN) return next();
    return checkLibrarianOwnership(req, res, next);
  },
  seatController.deleteSeat
);

// PATCH /libraries/:libraryId/seats/:seatId
router.patch(
  '/:seatId',
  authenticate,
  authorize([Role.ADMIN, Role.LIBRARIAN]),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role === Role.ADMIN) return next();
    return checkLibrarianOwnership(req, res, next);
  },
  seatController.updateSeat
);

router.use('/:seatId', seatReservationRouter);

export default router; 