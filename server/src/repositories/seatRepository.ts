import { FilterQuery } from 'mongoose';
import { Seat, ISeat } from '../models/Seat';
import { CreateSeatDto, UpdateSeatDto } from '../types/seat';

export class SeatRepository {
  async findAll(libraryId: string, filter: { floor?: string; area?: string } = {}) {
    const query: FilterQuery<ISeat> = { libraryId };
    
    if (filter.floor) query.floor = filter.floor;
    if (filter.area) query.area = filter.area;
    
    return Seat.find(query).sort({ code: 1 });
  }

  async findById(libraryId: string, seatId: string) {
    return Seat.findOne({ _id: seatId, libraryId });
  }

  async create(libraryId: string, seatData: CreateSeatDto) {
    const seat = new Seat({
      ...seatData,
      libraryId
    });
    return seat.save();
  }

  async update(libraryId: string, seatId: string, seatData: UpdateSeatDto) {
    return Seat.findOneAndUpdate(
      { _id: seatId, libraryId },
      { $set: seatData },
      { new: true }
    );
  }

  async delete(libraryId: string, seatId: string) {
    return Seat.findOneAndDelete({ _id: seatId, libraryId });
  }

  async findByCode(libraryId: string, code: string) {
    return Seat.findOne({ libraryId, code });
  }

  async hasActiveReservations(seatId: string): Promise<boolean> {
    // This will be implemented when we add reservations
    // For now, return false to allow deletion
    return false;
  }
} 