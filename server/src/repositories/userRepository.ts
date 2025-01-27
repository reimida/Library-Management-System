import { RegisterInput } from "@/validations/authSchemas";
import { UserModel, User } from "../models/User";

export async function createUserInDB(userData: RegisterInput): Promise<User> {
  return UserModel.create(userData);
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return UserModel.findOne({ email });
} 