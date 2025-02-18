import { SeatRepository } from '../repositories/seatRepository';
import { CreateSeatInput, UpdateSeatInput } from '../validations/seatSchemas';
import { NotFoundError, ConflictError, BusinessError } from '../utils/errors';

const seatRepository = new SeatRepository();

export async function getSeats(libraryId: string, filter: { floor?: string; area?: string } = {}) {
  return seatRepository.findAll(libraryId, filter);
}

export async function getSeatById(libraryId: string, seatId: string) {
  const seat = await seatRepository.findById(libraryId, seatId);
  if (!seat) throw new NotFoundError('Seat');
  return seat;
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

  const seat = await seatRepository.update(libraryId, seatId, seatData);
  if (!seat) throw new NotFoundError('Seat');
  return seat;
}

export async function deleteSeat(libraryId: string, seatId: string) {
  const seat = await seatRepository.findById(libraryId, seatId);
  if (!seat) throw new NotFoundError('Seat');

  const hasReservations = await seatRepository.hasActiveReservations(seatId);
  if (hasReservations) {
    throw new BusinessError('Cannot delete seat with active reservations');
  }

  await seatRepository.delete(libraryId, seatId);
}
