import { ILibrary } from '../models/Library';
import {
  createLibraryInDB,
  deleteLibraryFromDB,
  getAllLibraries,
  getLibraryById,
  updateLibraryInDB,
} from '../repositories/libraryRepository';
import type { LibraryInput } from '../validations/librarySchemas';
import { createSchedule } from './scheduleService';
import { deleteSchedule } from './scheduleService';

export type CreateLibraryInput = LibraryInput;
export type UpdateLibraryInput = Partial<LibraryInput>;

export async function createLibrary(libraryData: CreateLibraryInput): Promise<ILibrary> {
    const library = await createLibraryInDB(libraryData);
    // Create default schedule.  Error handling is important here.
    try {
      const defaultSchedule = {
          schedule: {
            monday: { open: "09:00", close: "17:00" },
            tuesday: { open: "09:00", close: "17:00" },
            wednesday: { open: "09:00", close: "17:00" },
            thursday: { open: "09:00", close: "17:00" },
            friday: { open: "09:00", close: "17:00" },
            saturday: { open: "09:00", close: "17:00" },
            sunday: { open: "09:00", close: "17:00" }
          }
      };
      await createSchedule(library._id.toString(), defaultSchedule); // Create schedule
    } catch (error) {
        // Rollback: Delete library if schedule creation fails
        await deleteLibraryFromDB(library._id.toString());
        throw error; // Re-throw to be handled by controller
    }

    return library;
}

export async function getLibrary(libraryId: string): Promise<ILibrary> {
  return await getLibraryById(libraryId);
}

export async function listLibraries(params?: {
  includeInactive?: boolean;
}): Promise<ILibrary[]> {
  const filters = params?.includeInactive ? {} : { isActive: true };
  return await getAllLibraries(filters);
}

export async function updateLibrary(
  libraryId: string,
  updateData: UpdateLibraryInput
): Promise<ILibrary> {
  // operatingHours are now handled separately in the schedule service
  return await updateLibraryInDB(libraryId, updateData);
}

export async function deleteLibrary(libraryId: string): Promise<ILibrary> {
  await deleteSchedule(libraryId); // Delete associated schedule
  return await deleteLibraryFromDB(libraryId);
} 