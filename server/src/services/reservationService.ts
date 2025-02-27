import { ReservationRepository } from '../repositories/reservationRepository';
import { ReservationStatus, IReservation } from '../models/Reservation';
import { validateMongoId } from '../utils/controllerUtils';
import { ReservationInput } from '../validations/reservationSchemas';
import { SeatRepository } from '../repositories/seatRepository';
import { BusinessError, ConflictError, NotFoundError } from '../utils/errors';
import * as libraryRepository from '../repositories/libraryRepository';

const reservationRepository = new ReservationRepository();
const seatRepository = new SeatRepository();

export async function createReservation(userId: string, reservationData: ReservationInput): Promise<IReservation> {
    validateMongoId(reservationData.seatId, 'seat');
    await validateSeatAvailability(reservationData.seatId, reservationData.startTime, reservationData.endTime);

    try {
        const reservationDataForDb = {
            seatId: reservationData.seatId,
            startTime: new Date(reservationData.startTime),
            endTime: new Date(reservationData.endTime)
        };
        return await reservationRepository.create(userId, reservationDataForDb);
    } catch (error) {
        throw error;
    }
}

export async function getReservationById(id: string): Promise<IReservation> {
    return await reservationRepository.getById(id);
}

export async function getAllUserReservations(userId: string, status?: string): Promise<IReservation[]> {
    const reservations = await reservationRepository.getAllUserReservations(userId);
    
    if (status) {
        return reservations.filter(reservation => reservation.status === status);
    }
    
    return reservations;
}

export async function getAllLibraryReservations(libraryId: string, status?: string): Promise<IReservation[]> {
    // Verify library exists
    try {
        await libraryRepository.getLibraryById(libraryId);
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw new NotFoundError('Library');
        }
        throw error;
    }
    
    const reservations = await reservationRepository.getAllLibraryReservations(libraryId);
    
    if (status) {
        return reservations.filter(reservation => reservation.status === status);
    }
    
    return reservations;
}

export async function getAllSeatReservations(
    seatId: string, 
    filters?: { 
        startDate?: string; 
        endDate?: string; 
        status?: string 
    }
): Promise<IReservation[]> {
    // Verify seat exists
    try {
        await seatRepository.findById("", seatId);
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw new NotFoundError('Seat');
        }
        throw error;
    }
    
    let reservations = await reservationRepository.getAllSeatReservations(seatId);
    
    // Apply filters
    if (filters) {
        if (filters.status) {
            reservations = reservations.filter(reservation => 
                reservation.status === filters.status
            );
        }
        
        if (filters.startDate && filters.endDate) {
            const startDate = new Date(filters.startDate);
            const endDate = new Date(filters.endDate);
            
            reservations = reservations.filter(reservation => 
                reservation.startTime >= startDate && 
                reservation.endTime <= endDate
            );
        }
    }
    
    return reservations;
}

export async function cancelReservation(id: string): Promise<IReservation> {
    return await reservationRepository.updateStatus(id, ReservationStatus.CANCELLED);
}

export async function cancelUserReservation(userId: string, reservationId: string): Promise<IReservation> {
    // Get the reservation
    const reservation = await reservationRepository.getById(reservationId);
    
    // Check if the reservation belongs to the user
    if (reservation.userId.toString() !== userId) {
        throw new NotFoundError('Reservation');
    }
    
    // Cancel the reservation
    return await reservationRepository.updateStatus(reservationId, ReservationStatus.CANCELLED);
}

export async function validateSeatAvailability(seatId: string, startTime: string, endTime: string): Promise<void> {
    try {
        const seat = await seatRepository.findById("", seatId);
        
        if (!seat) {
            throw new BusinessError('Seat not found');
        }
        
        const existingReservations = await reservationRepository.getAllSeatReservations(seatId);
        
        for (const reservation of existingReservations) {
            if (reservation.status === ReservationStatus.ACTIVE) {
                const newStart = new Date(startTime);
                const newEnd = new Date(endTime);
                const existingStart = reservation.startTime;
                const existingEnd = reservation.endTime;
                
                if ((newStart < existingEnd) && (newEnd > existingStart)) {
                    throw new ConflictError('Seat is already reserved for this time slot');
                }
            }
        }
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw new BusinessError('Seat not found');
        }
        throw error;
    }
} 