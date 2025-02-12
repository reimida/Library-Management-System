import { Types } from 'mongoose';
import Library, { ILibrary } from '../models/Library';

export async function createLibraryInDB(libraryData: Partial<ILibrary>): Promise<ILibrary> {
  const library = new Library(libraryData);
  return await library.save();
}

export async function getLibraryById(id: string): Promise<ILibrary | null> {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid library ID');
  return await Library.findById(id);
}

export async function getAllLibraries(filters?: {
  isActive?: boolean;
}): Promise<ILibrary[]> {
  const query = filters ? { ...filters } : {};
  return await Library.find(query);
}

export async function updateLibraryInDB(
  id: string,
  updateData: Partial<ILibrary>
): Promise<ILibrary | null> {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid library ID');
  return await Library.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );
}

export async function deleteLibraryFromDB(id: string): Promise<ILibrary | null> {
  if (!Types.ObjectId.isValid(id)) throw new Error('Invalid library ID');
  return await Library.findByIdAndDelete(id);
}

export async function findLibraryByCode(code: string): Promise<ILibrary | null> {
  return await Library.findOne({ libraryCode: code.toUpperCase() });
} 