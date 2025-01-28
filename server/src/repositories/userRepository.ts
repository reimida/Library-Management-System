import { RegisterInput } from "@/validations/authSchemas";
import User, { IUser } from "../models/User";
import type { UpdateProfileInput } from "../validations/authSchemas";

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