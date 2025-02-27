import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/roleMiddleware';
import { Role } from '../types/auth';
import {
    createUserReservation,
    getUserReservations,
    cancelUserReservation,
    getLibraryReservations,
    getSeatReservations
} from '../controllers/reservationController';
import { checkLibrarianOwnership } from '../middlewares/checkLibrarianOwnership';
import { Request, Response, NextFunction } from 'express';

// Create separate routers
export const userReservationRouter = Router();
export const libraryReservationRouter = Router({ mergeParams: true });
export const seatReservationRouter = Router({ mergeParams: true });

// User routes
userReservationRouter.get('/me/reservations', authenticate, getUserReservations);
userReservationRouter.post('/me/reservations', authenticate, createUserReservation);
userReservationRouter.delete('/me/reservations/:id', authenticate, cancelUserReservation);

// Library reservation routes
libraryReservationRouter.get(
    '/reservations',
    authenticate,
    authorize([Role.ADMIN, Role.LIBRARIAN]),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.user?.role === Role.ADMIN) return next();
      return checkLibrarianOwnership(req, res, next);
    },
    getLibraryReservations
);

// Seat reservation routes
seatReservationRouter.get(
    '/reservations',
    authenticate,
    authorize([Role.ADMIN, Role.LIBRARIAN]),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.user?.role === Role.ADMIN) return next();
      return checkLibrarianOwnership(req, res, next);
    },
    getSeatReservations
);

// No default export - we export the individual routers 