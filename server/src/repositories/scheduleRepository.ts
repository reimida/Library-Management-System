import { Types } from 'mongoose';
import Schedule, { ISchedule } from '../models/Schedule';
import { NotFoundError, BusinessError, ConflictError } from '../utils/errors';
import { MongoServerError } from 'mongodb';

export class ScheduleRepository {
  async create(libraryId: string, scheduleData: Partial<ISchedule>): Promise<ISchedule> {
    if (!Types.ObjectId.isValid(libraryId)) {
      throw new BusinessError('Invalid library ID');
    }
    try {
      const schedule = new Schedule({ ...scheduleData, libraryId });
      return await schedule.save();
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
          throw new ConflictError("A schedule for this library already exists.");
      }
      throw error
    }
  }

  async findByLibraryId(libraryId: string): Promise<ISchedule> {
    if (!Types.ObjectId.isValid(libraryId)) {
      throw new BusinessError('Invalid library ID');
    }
    const schedule = await Schedule.findOne({ libraryId });
    if (!schedule) {
      throw new NotFoundError('Schedule');
    }
    return schedule;
  }

  async update(libraryId: string, scheduleData: Partial<ISchedule>): Promise<ISchedule> {
    if (!Types.ObjectId.isValid(libraryId)) {
      throw new BusinessError('Invalid library ID');
    }
    const updatedSchedule = await Schedule.findOneAndUpdate(
      { libraryId },
      { $set: scheduleData },
      { new: true, runValidators: true }
    );
    if (!updatedSchedule) {
      throw new NotFoundError('Schedule');
    }
    return updatedSchedule;
  }

    async delete(libraryId: string): Promise<ISchedule> {
        if (!Types.ObjectId.isValid(libraryId)) {
            throw new BusinessError("Invalid library ID");
        }
        const deletedSchedule = await Schedule.findOneAndDelete({ libraryId });
        if (!deletedSchedule) {
            throw new NotFoundError("Schedule");
        }
        return deletedSchedule;
    }
} 