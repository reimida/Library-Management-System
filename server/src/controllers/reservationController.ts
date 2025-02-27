import { Request, Response } from 'express';
import * as reservationService from '../services/reservationService';
import { asyncHandler } from '../utils/asyncHandler';
import { validateId } from '../utils/controllerUtils';
import { ReservationSchema } from '../validations/reservationSchemas';
import { handleControllerError, sendSuccess } from '../utils/controllerUtils';

// User Endpoints
export const createUserReservation = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId; // Assuming authentication middleware adds user info
    
    try {
        const validatedData = ReservationSchema.parse(req.body);
        const reservation = await reservationService.createReservation(userId, validatedData);
        return sendSuccess(res, reservation, 'Reservation created successfully', 201);
    } catch (error) {
        return handleControllerError(error, res);
    }
});

export const getUserReservations = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { status } = req.query;
    
    try {
        const reservations = await reservationService.getAllUserReservations(
            userId, 
            status ? String(status) : undefined
        );
        
        return sendSuccess(res, reservations);
    } catch (error) {
        return handleControllerError(error, res);
    }
});

export const cancelUserReservation = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    
    try {
        validateId(id, 'reservation');
        await reservationService.cancelUserReservation(userId, id);
        
        return sendSuccess(res, null, 'Reservation cancelled successfully');
    } catch (error) {
        return handleControllerError(error, res);
    }
});

// Admin/Librarian Endpoints
export const getLibraryReservations = asyncHandler(async (req: Request, res: Response) => {
    const { libraryId } = req.params;
    const { status } = req.query;
    
    try {
        validateId(libraryId, 'library');
        const reservations = await reservationService.getAllLibraryReservations(
            libraryId,
            status ? String(status) : undefined
        );
        
        return sendSuccess(res, reservations);
    } catch (error) {
        return handleControllerError(error, res);
    }
});

export const getSeatReservations = asyncHandler(async (req: Request, res: Response) => {
    const { seatId } = req.params;
    const { startDate, endDate, status } = req.query;
    
    try {
        validateId(seatId, 'seat');
        const reservations = await reservationService.getAllSeatReservations(
            seatId,
            {
                startDate: startDate ? String(startDate) : undefined,
                endDate: endDate ? String(endDate) : undefined,
                status: status ? String(status) : undefined
            }
        );
        
        return sendSuccess(res, reservations);
    } catch (error) {
        return handleControllerError(error, res);
    }
}); 