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
import { librarySchema, LibraryInput } from '../validations/librarySchemas';
import type { z } from 'zod';

// Define types using Zod inference
export type CreateLibraryInput = LibraryInput;
export type UpdateLibraryInput = Partial<LibraryInput>;

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