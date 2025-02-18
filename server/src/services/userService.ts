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
  const user = await userRepository.getUserProfileFromDB(userId);
  if (!user) throw new NotFoundError('User');
  return user;
}

export async function updateUserProfile(
  userId: string,
  updateData: UpdateProfileInput
): Promise<IUser> {
  const updatedUser = await userRepository.updateUser(userId, updateData);
  if (!updatedUser) {
    throw new NotFoundError('User');
  }
  
  const userResponse = updatedUser.toObject();
  delete userResponse.password;
  return userResponse as IUser;
}

export async function assignUserAsLibrarian(userId: string, libraryId: string): Promise<IUser> {
  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  // Check role before checking library to fail fast
  if (user.role === Role.LIBRARIAN) {
    throw new ConflictError('User is already a librarian');
  }

  const library = await getLibraryById(libraryId);
  if (!library) {
    throw new NotFoundError('Library');
  }

  const isAlreadyAssigned = await userRepository.isUserAssignedToLibrary(userId, libraryId);
  if (isAlreadyAssigned) {
    throw new ConflictError('User is already assigned to this library');
  }

  // First update user role
  const updatedUser = await userRepository.updateUserRoleInDB(userId, Role.LIBRARIAN);
  if (!updatedUser) {
    throw new BusinessError('Failed to update user role');
  }

  // Then add to library
  const updatedLibrary = await userRepository.addUserAsLibrarian(userId, libraryId);
  if (!updatedLibrary) {
    // Rollback role change if library update fails
    await userRepository.updateUserRoleInDB(userId, Role.USER);
    throw new BusinessError('Failed to assign librarian to library');
  }

  return updatedUser;
}

export async function removeUserAsLibrarian(userId: string, libraryId: string): Promise<IUser> {
  const user = await getUserById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  if (user.role !== Role.LIBRARIAN) {
    throw new BusinessError('User is not a librarian');
  }

  const library = await getLibraryById(libraryId);
  if (!library) {
    throw new NotFoundError('Library');
  }

  const isAssigned = await userRepository.isUserAssignedToLibrary(userId, libraryId);
  if (!isAssigned) {
    throw new BusinessError('User is not assigned to this library');
  }

  // First remove from library
  const updatedLibrary = await userRepository.removeUserAsLibrarianFromDB(userId, libraryId);
  if (!updatedLibrary) {
    throw new BusinessError('Failed to remove librarian from library');
  }

  // Then update role back to user
  const updatedUser = await userRepository.updateUserRoleInDB(userId, Role.USER);
  if (!updatedUser) {
    throw new NotFoundError('User');
  }

  return updatedUser;
}

export async function checkLibrarianAccess(userId: string, libraryId: string): Promise<boolean> {
  const library = await getLibraryById(libraryId);
  if (!library) {
    throw new NotFoundError('Library');
  }

  return library.librarians.some(
    librarianId => librarianId.toString() === userId
  );
}

export async function getUserById(userId: string): Promise<IUser> {
  const user = await userRepository.getUserById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }
  return user;
}

export async function findUserByEmail(email: string): Promise<IUser> {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw new NotFoundError('User');
  }
  return user;
} 