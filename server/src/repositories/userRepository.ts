import { RegisterInput } from "@/validations/authSchemas";
import User, { IUser } from "../models/User";
import type { UpdateProfileInput } from "../validations/authSchemas";
import mongoose, { Types } from "mongoose";
import { Role } from "../types/auth";
import Library, { ILibrary } from "../models/Library";

export async function createUserInDB(userData: RegisterInput): Promise<IUser> {
  return User.create(userData) as unknown as IUser;
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email });
}

export async function getUserById(userId: string): Promise<IUser | null> {
  return User.findById(userId);
}

export async function updateUser(
  userId: string, 
  userData: UpdateProfileInput
): Promise<IUser | null> {
  return User.findByIdAndUpdate(
    userId,
    { $set: userData },
    /*new: true returns updated document
    runValidators ensures mongoose validations run on update*/
    { new: true, runValidators: true }
  ) as unknown as IUser;
}

export async function updateUserRoleInDB(userId: string, role: Role): Promise<IUser | null> {
  return User.findByIdAndUpdate(
    userId,
    { $set: { role } },
    { new: true, runValidators: true }
  );
}

export async function addUserAsLibrarian(
  userId: string,
  libraryId: string
): Promise<ILibrary | null> {
  return Library.findByIdAndUpdate(
    libraryId,
    { $addToSet: { librarians: new Types.ObjectId(userId) } },
    { new: true, runValidators: true }
  );
}

export async function removeUserAsLibrarian(
  userId: string,
  libraryId: string
): Promise<ILibrary | null> {
  return Library.findByIdAndUpdate(
    libraryId,
    { $pull: { librarians: new Types.ObjectId(userId) } },
    { new: true }
  );
}

export async function isUserAssignedToLibrary(
  userId: string,
  libraryId: string
): Promise<boolean> {
  const library = await Library.findOne({
    _id: libraryId,
    librarians: new Types.ObjectId(userId)
  });
  return !!library;
} 