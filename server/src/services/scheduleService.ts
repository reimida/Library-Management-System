import { ScheduleRepository } from '../repositories/scheduleRepository';
import { ScheduleInput, UpdateScheduleInput } from '../validations/scheduleSchemas';
import { ISchedule } from '../models/Schedule';

const scheduleRepository = new ScheduleRepository();

export async function createSchedule(libraryId: string, scheduleData: ScheduleInput): Promise<ISchedule> {
  return scheduleRepository.create(libraryId, scheduleData);
}

export async function getScheduleByLibraryId(libraryId: string): Promise<ISchedule> {
  return scheduleRepository.findByLibraryId(libraryId);
}

export async function updateSchedule(libraryId: string, scheduleData: UpdateScheduleInput): Promise<ISchedule>
{
  return scheduleRepository.update(libraryId, scheduleData);
}

export async function deleteSchedule(libraryId: string): Promise<ISchedule> {
    return scheduleRepository.delete(libraryId);
} 