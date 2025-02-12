import { ILibrary } from '../models/Library';
import {
  createLibraryInDB,
  deleteLibraryFromDB,
  findLibraryByCode,
  getAllLibraries,
  getLibraryById,
  updateLibraryInDB,
} from '../repositories/libraryRepository';

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
  // Check if library with same code exists
  const existingLibrary = await findLibraryByCode(libraryData.libraryCode);
  if (existingLibrary) {
    throw new Error('Library with this code already exists');
  }

  return await createLibraryInDB(libraryData);
}

export async function getLibrary(libraryId: string): Promise<ILibrary> {
  const library = await getLibraryById(libraryId);
  if (!library) {
    throw new Error('Library not found');
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
  // If libraryCode is being updated, check for duplicates
  if (updateData.libraryCode) {
    const existingLibrary = await findLibraryByCode(updateData.libraryCode);
    if (existingLibrary && existingLibrary._id.toString() !== libraryId) {
      throw new Error('Library with this code already exists');
    }
  }

  const updatedLibrary = await updateLibraryInDB(libraryId, updateData);
  if (!updatedLibrary) {
    throw new Error('Library not found');
  }
  return updatedLibrary;
}

export async function deleteLibrary(libraryId: string): Promise<ILibrary> {
  const deletedLibrary = await deleteLibraryFromDB(libraryId);
  if (!deletedLibrary) {
    throw new Error('Library not found');
  }
  return deletedLibrary;
}

export async function getLibraryByCode(code: string): Promise<ILibrary | null> {
  return await findLibraryByCode(code);
}

export async function toggleLibraryStatus(
  libraryId: string,
  isActive: boolean
): Promise<ILibrary> {
  const updatedLibrary = await updateLibraryInDB(libraryId, { isActive });
  if (!updatedLibrary) {
    throw new Error('Library not found');
  }
  return updatedLibrary;
} 