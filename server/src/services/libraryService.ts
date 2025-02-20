import { ILibrary } from '../models/Library';
import {
  createLibraryInDB,
  deleteLibraryFromDB,
  getAllLibraries,
  getLibraryById,
  updateLibraryInDB,
} from '../repositories/libraryRepository';
import type { LibraryInput } from '../validations/librarySchemas';

export type CreateLibraryInput = LibraryInput;
export type UpdateLibraryInput = Partial<LibraryInput>;

export async function createLibrary(libraryData: CreateLibraryInput): Promise<ILibrary> {
  return await createLibraryInDB(libraryData);
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
  return await updateLibraryInDB(libraryId, updateData);
}

export async function deleteLibrary(libraryId: string): Promise<ILibrary> {
  return await deleteLibraryFromDB(libraryId);
} 