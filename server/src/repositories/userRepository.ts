import { RegisterInput } from "@/validations/authSchemas";
import User, { IUser } from "../models/User";
import type { UpdateProfileInput } from "../validations/authSchemas";
import mongoose, { Types } from "mongoose";
import { Role } from "../types/auth";
import Library, { ILibrary } from "../models/Library";
import { NotFoundError, BusinessError, ConflictError } from "../utils/errors";
import { MongoServerError } from "mongodb";

export async function createUserInDB(userData: RegisterInput): Promise<IUser> {
  try {
    return await User.create(userData) as unknown as IUser;
  } catch (error) {
    // Check for MongoDB duplicate key error (code 11000)
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new ConflictError('User with this email already exists');
    }
    throw error;
  }
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email });
}

export async function getUserById(userId: string): Promise<IUser> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new BusinessError('Invalid user ID');
  }
  
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }
  return user;
}

export async function updateUser(
  userId: string, 
  userData: UpdateProfileInput
): Promise<IUser> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new BusinessError('Invalid user ID');
  }
  
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: userData },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      throw new NotFoundError('User');
    }
    
    return updatedUser as IUser;
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new ConflictError('Email already in use');
    }
    throw error;
  }
}

export async function updateUserRoleInDB(userId: string, role: Role): Promise<IUser> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new BusinessError('Invalid user ID');
  }
  
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { role } },
    { new: true, runValidators: true }
  );
  
  if (!updatedUser) {
    throw new NotFoundError('User');
  }
  
  return updatedUser;
}

export async function addUserAsLibrarian(
  userId: string,
  libraryId: string
): Promise<ILibrary> {
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(libraryId)) {
    throw new BusinessError('Invalid ID format');
  }
  
  const library = await Library.findByIdAndUpdate(
    libraryId,
    { $addToSet: { librarians: new Types.ObjectId(userId) } },
    { new: true, runValidators: true }
  );
  
  if (!library) {
    throw new NotFoundError('Library');
  }
  
  return library;
}

export async function removeUserAsLibrarianFromDB(
  userId: string,
  libraryId: string
): Promise<ILibrary> {
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(libraryId)) {
    throw new BusinessError('Invalid ID format');
  }
  
  const library = await Library.findByIdAndUpdate(
    libraryId,
    { $pull: { librarians: new Types.ObjectId(userId) } },
    { new: true }
  );
  
  if (!library) {
    throw new NotFoundError('Library');
  }
  
  return library;
}

export async function isUserAssignedToLibrary(
  userId: string,
  libraryId: string
): Promise<boolean> {
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(libraryId)) {
    throw new BusinessError('Invalid ID format');
  }
  
  const library = await Library.findOne({
    _id: libraryId,
    librarians: new Types.ObjectId(userId)
  });
  return !!library;
}

export async function getUserProfileFromDB(userId: string): Promise<any> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new BusinessError('Invalid user ID');
  }
  
  const user = await User.findById(userId).select('-password').lean();
  if (!user) {
    throw new NotFoundError('User');
  }
  
  return user;
} 