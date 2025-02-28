import { Types } from 'mongoose';
import Reservation, { IReservation, ReservationStatus } from '../models/Reservation';
import { NotFoundError, BusinessError } from '../utils/errors';

export class ReservationRepository {
    async create(userId: string, reservationData: { seatId: string; startTime: Date; endTime: Date; }): Promise<IReservation> {
        try {
            const reservation = new Reservation({ userId, ...reservationData });
            return await reservation.save();
        } catch (error) {
            throw error; // Let the service layer handle specific error types (e.g., ConflictError)
        }
    }

    async getById(id: string): Promise<IReservation> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BusinessError('Invalid reservation ID');
        }

        const reservation = await Reservation.findById(id);
        if (!reservation) {
            throw new NotFoundError('Reservation');
        }
        return reservation;
    }

    async getUserReservations(userId: string, status?: ReservationStatus): Promise<IReservation[]> {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BusinessError('Invalid user ID');
        }

        const query: any = { userId };
        if (status) {
            query.status = status;
        }

        return Reservation.find(query).populate('seatId');
    }

    async getLibraryReservations(libraryId: string, status?: ReservationStatus): Promise<IReservation[]> {
        if (!Types.ObjectId.isValid(libraryId)) {
            throw new BusinessError('Invalid library ID');
        }

        // First get all reservations and populate seat data
        const query = Reservation.find({});
        if (status) {
            query.where('status').equals(status);
        }

        // This query is dependent on Seat having the libraryId
        return query.populate({
          path: 'seatId',
          match: { libraryId: libraryId },
        }).then(reservations => reservations.filter(reservation => reservation.seatId !== null));
    }

    async getSeatReservations(
        seatId: string, 
        filters?: { 
            startDate?: Date; 
            endDate?: Date; 
            status?: ReservationStatus 
        }
    ): Promise<IReservation[]> {
        if (!Types.ObjectId.isValid(seatId)) {
            throw new BusinessError('Invalid seat ID');
        }

        const query: any = { seatId };
        
        if (filters?.status) {
            query.status = filters.status;
        }
        
        if (filters?.startDate && filters?.endDate) {
            query.startTime = { $gte: filters.startDate };
            query.endTime = { $lte: filters.endDate };
        }

        return Reservation.find(query);
    }

    async updateStatus(id: string, status: ReservationStatus): Promise<IReservation> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BusinessError('Invalid reservation ID');
        }

        const updatedReservation = await Reservation.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedReservation) {
            throw new NotFoundError('Reservation');
        }

        return updatedReservation;
    }

    async delete(id: string): Promise<IReservation> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BusinessError('Invalid reservation ID');
        }

        const deletedReservation = await Reservation.findByIdAndDelete(id);

        if (!deletedReservation) {
            throw new NotFoundError('Reservation');
        }

        return deletedReservation;
    }
} 