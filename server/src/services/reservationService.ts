import { ReservationRepository } from '../repositories/reservationRepository';
import { ReservationStatus, IReservation } from '../models/Reservation';
import { ReservationInput, ReservationFilterInput } from '../validations/reservationSchemas';
import { SeatRepository } from '../repositories/seatRepository';
import { BusinessError, ConflictError, NotFoundError } from '../utils/errors';
import * as libraryRepository from '../repositories/libraryRepository';

const reservationRepository = new ReservationRepository();
const seatRepository = new SeatRepository();

export async function createReservation(userId: string, reservationData: ReservationInput): Promise<IReservation> {
    // Validate seat exists and is available
    await validateSeatAvailability(reservationData.seatId, reservationData.startTime, reservationData.endTime);

    // Convert string dates to Date objects
    const reservationDataForDb = {
        seatId: reservationData.seatId,
        startTime: new Date(reservationData.startTime),
        endTime: new Date(reservationData.endTime)
    };
    
    return await reservationRepository.create(userId, reservationDataForDb);
}

export async function getReservationById(id: string): Promise<IReservation> {
    return await reservationRepository.getById(id);
}

export async function getAllUserReservations(
    userId: string, 
    status?: ReservationStatus
): Promise<IReservation[]> {
    return await reservationRepository.getUserReservations(userId, status);
}

export async function getAllLibraryReservations(
    libraryId: string, 
    status?: ReservationStatus
): Promise<IReservation[]> {
    // Verify library exists
    await libraryRepository.getLibraryById(libraryId);
    
    return await reservationRepository.getLibraryReservations(libraryId, status);
}

export async function getAllSeatReservations(
    seatId: string, 
    filters?: ReservationFilterInput
): Promise<IReservation[]> {
    // Verify seat exists
    await seatRepository.findById("", seatId);
    
    // Convert string dates to Date objects if provided
    const dateFilters: { startDate?: Date; endDate?: Date; status?: ReservationStatus } = {};
    
    if (filters?.status) {
        dateFilters.status = filters.status;
    }
    
    if (filters?.startDate && filters?.endDate) {
        dateFilters.startDate = new Date(filters.startDate);
        dateFilters.endDate = new Date(filters.endDate);
    }
    
    return await reservationRepository.getSeatReservations(seatId, dateFilters);
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

// Private helper function to validate seat availability
async function validateSeatAvailability(seatId: string, startTime: string, endTime: string): Promise<void> {
    // Verify seat exists
    try {
        await seatRepository.findById("", seatId);
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw new BusinessError('Seat not found');
        }
        throw error;
    }
    
    // Check for conflicting reservations
    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);
    
    const existingReservations = await reservationRepository.getSeatReservations(seatId, {
        status: ReservationStatus.ACTIVE
    });
    
    for (const reservation of existingReservations) {
        const existingStart = reservation.startTime;
        const existingEnd = reservation.endTime;
        
        if ((newStart < existingEnd) && (newEnd > existingStart)) {
            throw new ConflictError('Seat is already reserved for this time slot');
        }
    }
} 