import { Request, Response } from 'express';
import * as reservationService from '../services/reservationService';
import { asyncHandler } from '../utils/asyncHandler';
import { validateId, validateAndExecute, sendSuccess, executeWithValidation } from '../utils/controllerUtils';
import { ReservationSchema, ReservationFilterSchema } from '../validations/reservationSchemas';
import { ReservationStatus } from '../models/Reservation';
import { NotFoundError, BusinessError } from '../utils/errors';

// User Endpoints
export const createUserReservation = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    
    return validateAndExecute(
        req,
        res,
        ReservationSchema,
        async (validatedData) => {
            const reservation = await reservationService.createReservation(userId, validatedData);
            return sendSuccess(res, reservation, 'Reservation created successfully', 201);
        }
    );
});

export const getUserReservations = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { status } = req.query;
    
    return executeWithValidation(
        req,
        res,
        () => {
            // Validation logic
            validateId(userId, 'user');
            
            // Validate status if provided
            if (status) {
                ReservationFilterSchema.pick({ status: true }).parse({ status: String(status) });
            }
        },
        async () => {
            // Handler logic
            const reservations = await reservationService.getAllUserReservations(
                userId,
                status ? String(status) as ReservationStatus : undefined
            );
            
            return sendSuccess(res, reservations);
        }
    );
});

export const cancelUserReservation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    
    return executeWithValidation(
        req,
        res,
        () => {
            // Validation logic
            validateId(id, 'reservation');
        },
        async () => {
            // Handler logic
            await reservationService.cancelUserReservation(userId, id);
            return sendSuccess(res, null, 'Reservation cancelled successfully');
        }
    );
});

// Admin/Librarian Endpoints
export const getLibraryReservations = asyncHandler(async (req: Request, res: Response) => {
    const { libraryId } = req.params;
    const { status } = req.query;
    
    return executeWithValidation(
        req,
        res,
        () => {
            // Validation logic
            validateId(libraryId, 'library');
            
            // Validate status if provided
            if (status) {
                ReservationFilterSchema.pick({ status: true }).parse({ status: String(status) });
            }
        },
        async () => {
            // Handler logic
            const reservations = await reservationService.getAllLibraryReservations(
                libraryId,
                status ? String(status) as ReservationStatus : undefined
            );
            
            return sendSuccess(res, reservations);
        }
    );
});

export const getSeatReservations = asyncHandler(async (req: Request, res: Response) => {
    const { seatId } = req.params;
    const { startDate, endDate, status } = req.query;
    
    return executeWithValidation(
        req,
        res,
        () => {
            // Validation logic
            validateId(seatId, 'seat');
            
            // Validate filter parameters if provided
            if (startDate || endDate || status) {
                const filterData = {
                    startDate: startDate ? String(startDate) : undefined,
                    endDate: endDate ? String(endDate) : undefined,
                    status: status ? String(status) : undefined
                };
                ReservationFilterSchema.parse(filterData);
            }
        },
        async () => {
            // Handler logic
            const filterData = {
                startDate: startDate ? String(startDate) : undefined,
                endDate: endDate ? String(endDate) : undefined,
                status: status ? String(status) as ReservationStatus : undefined
            };
            
            const reservations = await reservationService.getAllSeatReservations(
                seatId,
                filterData
            );
            
            return sendSuccess(res, reservations);
        }
    );
});

export const getReservation = asyncHandler(async (req: Request, res: Response) => {
    const { reservationId } = req.params;
    
    return executeWithValidation(
        req,
        res,
        () => {
            // Validation logic
            validateId(reservationId, 'reservation');
        },
        async () => {
            // Handler logic
            const reservation = await reservationService.getReservationById(reservationId);
            
            if (!reservation) {
                throw new NotFoundError('Reservation not found');
            }
            
            return sendSuccess(res, reservation);
        }
    );
});

export const cancelReservation = asyncHandler(async (req: Request, res: Response) => {
    const { reservationId } = req.params;
    
    return executeWithValidation(
        req,
        res,
        () => {
            // Validation logic
            validateId(reservationId, 'reservation');
        },
        async () => {
            // Handler logic
            const cancelledReservation = await reservationService.cancelReservation(reservationId);
            return sendSuccess(res, cancelledReservation);
        }
    );
});

export const createReservation = asyncHandler(async (req: Request, res: Response) => {
    return validateAndExecute(
        req,
        res,
        ReservationSchema,
        async (validatedData) => {
            // Need to extract userId from request or params
            const userId = req.body.userId || req.params.userId;
            
            if (!userId) {
                throw new BusinessError('User ID is required');
            }
            
            validateId(userId, 'user');
            const newReservation = await reservationService.createReservation(userId, validatedData);
            return sendSuccess(res, newReservation, 'Reservation created successfully', 201);
        }
    );
}); 