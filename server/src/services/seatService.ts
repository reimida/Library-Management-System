import { SeatRepository } from '../repositories/seatRepository';
import { CreateSeatInput, UpdateSeatInput } from '../validations/seatSchemas';
import { ApiError } from '../utils/apiError';

const seatRepository = new SeatRepository();

export async function getSeats(libraryId: string, filter: { floor?: string; area?: string } = {}) {
  return seatRepository.findAll(libraryId, filter);
}

export async function getSeatById(libraryId: string, seatId: string) {
  const seat = await seatRepository.findById(libraryId, seatId);
  if (!seat) throw new ApiError(404, 'Seat not found');
  return seat;
}

export async function createSeat(libraryId: string, seatData: CreateSeatInput) {
  // Check if seat code already exists in this library
  const existingSeat = await seatRepository.findByCode(libraryId, seatData.code);
  if (existingSeat) {
    throw new ApiError(409, 'Seat code already exists in this library');
  }

  return seatRepository.create(libraryId, seatData);
}

export async function updateSeat(libraryId: string, seatId: string, seatData: UpdateSeatInput) {
  // If code is being updated, check for uniqueness
  if (seatData.code) {
    const existingSeat = await seatRepository.findByCode(libraryId, seatData.code) as any;
    if (existingSeat && existingSeat._id.toString() !== seatId) {
      throw new ApiError(409, 'Seat code already exists in this library');
    }
  }

  const seat = await seatRepository.update(libraryId, seatId, seatData);
  if (!seat) throw new ApiError(404, 'Seat not found');
  return seat;
}

export async function deleteSeat(libraryId: string, seatId: string) {
  // Check if seat exists
  const seat = await seatRepository.findById(libraryId, seatId);
  if (!seat) throw new ApiError(404, 'Seat not found');

  // Check for active reservations
  const hasReservations = await seatRepository.hasActiveReservations(seatId);
  if (hasReservations) {
    throw new ApiError(400, 'Cannot delete seat with active reservations');
  }

  await seatRepository.delete(libraryId, seatId);
}
