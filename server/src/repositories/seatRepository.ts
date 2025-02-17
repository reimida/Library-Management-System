import { FilterQuery } from 'mongoose';
import { Seat, ISeat } from '../models/Seat';
import mongoose from 'mongoose';

export class SeatRepository {
  async findAll(libraryId: string, filter: { floor?: string; area?: string } = {}) {
    const query: FilterQuery<ISeat> = { libraryId };
    
    if (filter.floor) query.floor = filter.floor;
    if (filter.area) query.area = filter.area;
    
    return Seat.find(query).sort({ code: 1 });
  }

  async findById(libraryId: string, seatId: string) {
    if (!mongoose.Types.ObjectId.isValid(seatId)) return null;
    return Seat.findOne({ 
      _id: new mongoose.Types.ObjectId(seatId), 
      libraryId 
    });
  }

  async create(libraryId: string, seatData: Partial<ISeat>) {
    const seat = new Seat({
      ...seatData,
      libraryId
    });
    return seat.save();
  }

  async update(libraryId: string, seatId: string, seatData: Partial<ISeat>) {
    if (!mongoose.Types.ObjectId.isValid(seatId)) return null;
    return Seat.findOneAndUpdate(
      { 
        _id: new mongoose.Types.ObjectId(seatId), 
        libraryId 
      },
      { $set: seatData },
      { new: true }
    );
  }

  async delete(libraryId: string, seatId: string) {
    if (!mongoose.Types.ObjectId.isValid(seatId)) return null;
    return Seat.findOneAndDelete({ 
      _id: new mongoose.Types.ObjectId(seatId), 
      libraryId 
    });
  }

  async findByCode(libraryId: string, code: string) {
    return Seat.findOne({ libraryId, code });
  }

  async hasActiveReservations(seatId: string): Promise<boolean> {
    // TODO: Implement when reservation module is added
    return false;
  }
} 