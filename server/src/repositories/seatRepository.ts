import { FilterQuery } from 'mongoose';
import { Seat, ISeat } from '../models/Seat';
import mongoose from 'mongoose';
import { NotFoundError, BusinessError, ConflictError } from '../utils/errors';
import { MongoServerError } from 'mongodb';

export class SeatRepository {
  async findAll(libraryId: string, filter: { floor?: string; area?: string } = {}) {
    if (!mongoose.Types.ObjectId.isValid(libraryId)) {
      throw new BusinessError('Invalid library ID');
    }
    
    const query: FilterQuery<ISeat> = { libraryId };
    
    if (filter.floor) query.floor = filter.floor;
    if (filter.area) query.area = filter.area;
    
    return Seat.find(query).sort({ code: 1 });
  }

  async findById(libraryId: string, seatId: string) {
    if (libraryId && !mongoose.Types.ObjectId.isValid(libraryId)) {
      throw new BusinessError('Invalid library ID');
    }
    
    if (!mongoose.Types.ObjectId.isValid(seatId)) {
      throw new BusinessError('Invalid seat ID');
    }
    
    const query: any = { _id: new mongoose.Types.ObjectId(seatId) };
    
    if (libraryId) {
      query.libraryId = libraryId;
    }
    
    const seat = await Seat.findOne(query);
    
    if (!seat) {
      throw new NotFoundError('Seat');
    }
    
    return seat;
  }

  async create(libraryId: string, seatData: Partial<ISeat>) {
    if (!mongoose.Types.ObjectId.isValid(libraryId)) {
      throw new BusinessError('Invalid library ID');
    }
    
    try {
      const seat = new Seat({
        ...seatData,
        libraryId
      });
      return await seat.save();
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new ConflictError('Seat code already exists in this library');
      }
      throw error;
    }
  }

  async update(libraryId: string, seatId: string, seatData: Partial<ISeat>) {
    if (!mongoose.Types.ObjectId.isValid(libraryId)) {
      throw new BusinessError('Invalid library ID');
    }
    
    if (!mongoose.Types.ObjectId.isValid(seatId)) {
      throw new BusinessError('Invalid seat ID');
    }
    
    try {
      const seat = await Seat.findOneAndUpdate(
        { 
          _id: new mongoose.Types.ObjectId(seatId), 
          libraryId 
        },
        { $set: seatData },
        { new: true }
      );
      
      if (!seat) {
        throw new NotFoundError('Seat');
      }
      
      return seat;
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new ConflictError('Seat code already exists in this library');
      }
      throw error;
    }
  }

  async delete(libraryId: string, seatId: string) {
    if (!mongoose.Types.ObjectId.isValid(libraryId)) {
      throw new BusinessError('Invalid library ID');
    }
    
    if (!mongoose.Types.ObjectId.isValid(seatId)) {
      throw new BusinessError('Invalid seat ID');
    }
    
    const seat = await Seat.findOneAndDelete({ 
      _id: new mongoose.Types.ObjectId(seatId), 
      libraryId 
    });
    
    if (!seat) {
      throw new NotFoundError('Seat');
    }
    
    return seat;
  }

  async findByCode(libraryId: string, code: string) {
    if (!mongoose.Types.ObjectId.isValid(libraryId)) {
      throw new BusinessError('Invalid library ID');
    }
    
    return Seat.findOne({ libraryId, code });
  }

  async hasActiveReservations(seatId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(seatId)) {
      throw new BusinessError('Invalid seat ID');
    }
    
    // TODO: Implement when reservation module is added
    return false;
  }
} 