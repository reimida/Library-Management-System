import User, { IUser } from '../models/User';
import * as userRepository from "../repositories/userRepository";
import { generateToken } from '../utils/jwtUtils';
import type { LoginInput, RegisterInput, UpdateProfileInput } from '../validations/authSchemas';
import { Role } from '../types/auth';
import { getLibraryById } from '../repositories/libraryRepository';
import { hashPassword, comparePasswords } from '../utils/passwordUtils';
import { NotFoundError, ConflictError, BusinessError } from '../utils/errors';


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Should be in env

// Rename to match controller's expected function name
export async function registerUser(userData: RegisterInput): Promise<IUser> {
  const existingUser = await userRepository.findUserByEmail(userData.email);
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  const hashedPassword = await hashPassword(userData.password);

  const userWithHashedPassword = {
    ...userData,
    password: hashedPassword,
    role: Role.USER
  };

  const user = await userRepository.createUserInDB(userWithHashedPassword);
  
  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;
  
  return userResponse;
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
  const user = await userRepository.findUserByEmail(loginData.email);
  if (!user) {
    throw new BusinessError('Invalid credentials');
  }

  const isPasswordValid = await comparePasswords(loginData.password, user.password);
  if (!isPasswordValid) {
    throw new BusinessError('Invalid credentials');
  }

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role as Role
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

export async function getUserProfile(userId: string) {
  return await userRepository.getUserProfileFromDB(userId);
}

export async function updateUserProfile(
  userId: string,
  updateData: UpdateProfileInput
): Promise<IUser> {
  const updatedUser = await userRepository.updateUser(userId, updateData);
  
  const userResponse = updatedUser.toObject();
  delete userResponse.password;
  return userResponse as IUser;
}

export async function assignUserAsLibrarian(userId: string, libraryId: string): Promise<IUser> {
  const user = await userRepository.getUserById(userId);

  // Check role before checking library to fail fast
  if (user.role === Role.LIBRARIAN) {
    throw new ConflictError('User is already a librarian');
  }

  const isAlreadyAssigned = await userRepository.isUserAssignedToLibrary(userId, libraryId);
  if (isAlreadyAssigned) {
    throw new ConflictError('User is already assigned to this library');
  }

  // First update user role
  const updatedUser = await userRepository.updateUserRoleInDB(userId, Role.LIBRARIAN);

  // Then add to library
  try {
    await userRepository.addUserAsLibrarian(userId, libraryId);
  } catch (error) {
    // Rollback role change if library update fails
    await userRepository.updateUserRoleInDB(userId, Role.USER);
    throw error;
  }

  return updatedUser;
}

export async function removeUserAsLibrarian(userId: string, libraryId: string): Promise<IUser> {
  const user = await getUserById(userId);

  if (user.role !== Role.LIBRARIAN) {
    throw new BusinessError('User is not a librarian');
  }

  const isAssigned = await userRepository.isUserAssignedToLibrary(userId, libraryId);
  if (!isAssigned) {
    throw new BusinessError('User is not assigned to this library');
  }

  // First remove from library
  await userRepository.removeUserAsLibrarianFromDB(userId, libraryId);

  // Then update role back to user
  return await userRepository.updateUserRoleInDB(userId, Role.USER);
}

export async function checkLibrarianAccess(userId: string, libraryId: string): Promise<boolean> {
  return await userRepository.isUserAssignedToLibrary(userId, libraryId);
}

export async function getUserById(userId: string): Promise<IUser> {
  const user = await userRepository.getUserById(userId);
  return user; // Now safe because repository throws NotFoundError if user is null
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return await userRepository.findUserByEmail(email);
} 