import { UserInput } from "../models/User";
import { createUserInDB } from "../repositories/userRepository";
import bcrypt from 'bcryptjs'

// Rename to match controller's expected function name
export async function registerUser(userData: UserInput) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const userWithHashedPassword = {
    ...userData,
    password: hashedPassword,
  };

  const createdUser = await createUserInDB(userWithHashedPassword);

  // Return user without password
  const { password: _, ...userWithoutPassword } = createdUser
  return userWithoutPassword;
} 