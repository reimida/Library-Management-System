import { ILibrary } from '../models/Library';
import {
  createLibraryInDB,
  deleteLibraryFromDB,
  findLibraryByCode,
  getAllLibraries,
  getLibraryById,
  updateLibraryInDB,
} from '../repositories/libraryRepository';
import { NotFoundError, ConflictError } from '../utils/errors';

// Define a base type without Mongoose Document properties
export interface LibraryData {
  name: string;
  libraryCode: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  operatingHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
  contactPhone: string;
  contactEmail: string;
  totalSeats: number;
  isActive?: boolean;
}

export type CreateLibraryInput = LibraryData;
export type UpdateLibraryInput = Partial<LibraryData>;

export async function createLibrary(libraryData: CreateLibraryInput): Promise<ILibrary> {
  const existingLibrary = await findLibraryByCode(libraryData.libraryCode);
  if (existingLibrary) {
    throw new ConflictError('Library with this code already exists');
  }

  return await createLibraryInDB(libraryData);
}

export async function getLibrary(libraryId: string): Promise<ILibrary> {
  const library = await getLibraryById(libraryId);
  if (!library) {
    throw new NotFoundError('Library');
  }
  return library;
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
  if (updateData.libraryCode) {
    const existingLibrary = await findLibraryByCode(updateData.libraryCode);
    if (existingLibrary && existingLibrary._id.toString() !== libraryId) {
      throw new ConflictError('Library with this code already exists');
    }
  }

  const updatedLibrary = await updateLibraryInDB(libraryId, updateData);
  if (!updatedLibrary) {
    throw new NotFoundError('Library');
  }
  return updatedLibrary;
}

export async function deleteLibrary(libraryId: string): Promise<ILibrary> {
  const deletedLibrary = await deleteLibraryFromDB(libraryId);
  if (!deletedLibrary) {
    throw new NotFoundError('Library');
  }
  return deletedLibrary;
} 