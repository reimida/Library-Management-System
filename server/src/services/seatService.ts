import { SeatRepository } from '../repositories/seatRepository';
import { CreateSeatInput, UpdateSeatInput } from '../validations/seatSchemas';
import { ConflictError } from '../utils/errors';

const seatRepository = new SeatRepository();

export async function getSeats(libraryId: string, filter: { floor?: string; area?: string } = {}) {
  return seatRepository.findAll(libraryId, filter);
}

export async function getSeatById(libraryId: string, seatId: string) {
  return seatRepository.findById(libraryId, seatId);
}

export async function createSeat(libraryId: string, seatData: CreateSeatInput) {
  const existingSeat = await seatRepository.findByCode(libraryId, seatData.code);
  if (existingSeat) {
    throw new ConflictError('Seat code already exists in this library');
  }

  return seatRepository.create(libraryId, seatData);
}

export async function updateSeat(libraryId: string, seatId: string, seatData: UpdateSeatInput) {
  // If code is being updated, check for uniqueness
  if (seatData.code) {
    const existingSeat = await seatRepository.findByCode(libraryId, seatData.code) as any;
    if (existingSeat && existingSeat._id.toString() !== seatId) {
      throw new ConflictError('Seat code already exists in this library');
    }
  }

  return seatRepository.update(libraryId, seatId, seatData);
}

export async function deleteSeat(libraryId: string, seatId: string) {
  const hasReservations = await seatRepository.hasActiveReservations(seatId);
  if (hasReservations) {
    throw new ConflictError('Cannot delete seat with active reservations');
  }

  await seatRepository.delete(libraryId, seatId);
}
