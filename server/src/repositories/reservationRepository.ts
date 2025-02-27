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

    async getAllUserReservations(userId: string): Promise<IReservation[]> {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BusinessError('Invalid user ID');
        }

        return Reservation.find({ userId }).populate('seatId'); // Consider populate for seat details
    }

    async getAllLibraryReservations(libraryId: string): Promise<IReservation[]> {
        if (!Types.ObjectId.isValid(libraryId)) {
            throw new BusinessError('Invalid library ID');
        }

        //This query is dependent of Seat having the libraryId, otherwise we cannot know which reservations belong to a library
        return Reservation.find({}).populate({
          path: 'seatId',
          match: { libraryId: libraryId },
        }).then(reservations => reservations.filter(reservation => reservation.seatId !== null));
    }

    async getAllSeatReservations(seatId: string): Promise<IReservation[]> {
        if (!Types.ObjectId.isValid(seatId)) {
            throw new BusinessError('Invalid seat ID');
        }

        return Reservation.find({ seatId });
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