import { UserModel, UserInput, User } from "../models/User";

export async function createUserInDB(userData: UserInput): Promise<User> {
  return UserModel.create(userData);
} 