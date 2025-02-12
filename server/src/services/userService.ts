import User, { IUser } from '../models/User';
import { createUserInDB, findUserByEmail, getUserById, updateUser } from "../repositories/userRepository";
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils/jwtUtils';
import type { LoginInput, RegisterInput, UpdateProfileInput } from '../validations/authSchemas';
import { Role } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Should be in env

// Rename to match controller's expected function name
export async function registerUser(userData: RegisterInput): Promise<IUser> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const userWithHashedPassword = {
    ...userData,
    password: hashedPassword,
    role: Role.USER // Set default role as USER enum value
  };

  const createdUser = await createUserInDB(userWithHashedPassword);
  return createdUser;
}

type LoginResponse = {
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
};

export async function loginUser(loginData: LoginInput) {
  const user = await findUserByEmail(loginData.email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role as Role // Cast the role to Role enum
  });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
}

export async function getUserProfile(userId: string): Promise<IUser | null> {
  const user = await getUserById(userId);
  return user;
}

export async function updateUserProfile(
  userId: string,
  updateData: UpdateProfileInput
): Promise<IUser | null> {
  const updatedUser = await updateUser(userId, updateData);
  return updatedUser;
} 