import { Types } from 'mongoose';
import Library, { ILibrary } from '../models/Library';
import { ConflictError, NotFoundError, BusinessError } from '../utils/errors';
import { MongoServerError } from 'mongodb';

export async function createLibraryInDB(libraryData: Partial<ILibrary>): Promise<ILibrary> {
  try {
    const library = new Library(libraryData);
    return await library.save();
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new ConflictError('Library with this code already exists');
    }
    throw error;
  }
}

export async function getLibraryById(id: string): Promise<ILibrary> {
  if (!Types.ObjectId.isValid(id)) {
    throw new BusinessError('Invalid library ID');
  }

  const library = await Library.findById(id);
  if (!library) {
    throw new NotFoundError('Library');
  }
  return library;
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
): Promise<ILibrary> {
  if (!Types.ObjectId.isValid(id)) {
    throw new BusinessError('Invalid library ID');
  }

  try {
    const updatedLibrary = await Library.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedLibrary) {
      throw new NotFoundError('Library');
    }

    return updatedLibrary;
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new ConflictError('Library with this code already exists');
    }
    throw error;
  }
}

export async function deleteLibraryFromDB(id: string): Promise<ILibrary> {
  if (!Types.ObjectId.isValid(id)) {
    throw new BusinessError('Invalid library ID');
  }

  const deletedLibrary = await Library.findByIdAndDelete(id);
  if (!deletedLibrary) {
    throw new NotFoundError('Library');
  }
  return deletedLibrary;
}

export async function findLibraryByCode(code: string): Promise<ILibrary | null> {
  return await Library.findOne({ libraryCode: code.toUpperCase() });
} 