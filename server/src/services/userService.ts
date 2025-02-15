import User, { IUser } from '../models/User';
import { 
  createUserInDB, 
  findUserByEmail, 
  getUserById, 
  updateUser, 
  updateUserRoleInDB, 
  addUserAsLibrarian, 
  removeUserAsLibrarian as removeUserAsLibrarianFromDB,
  isUserAssignedToLibrary
} from "../repositories/userRepository";
import { generateToken } from '../utils/jwtUtils';
import type { LoginInput, RegisterInput, UpdateProfileInput } from '../validations/authSchemas';
import { Role } from '../types/auth';
import { getLibraryById } from '../repositories/libraryRepository';
import { ApiError } from '../utils/apiError';
import { hashPassword, comparePasswords } from '../utils/passwordUtils';


const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Should be in env

// Rename to match controller's expected function name
export async function registerUser(userData: RegisterInput): Promise<IUser> {
  const hashedPassword = await hashPassword(userData.password);

  const userWithHashedPassword = {
    ...userData,
    password: hashedPassword,
    role: Role.USER
  };

  return await createUserInDB(userWithHashedPassword);
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

  const isPasswordValid = await comparePasswords(loginData.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
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

export async function assignUserAsLibrarian(userId: string, libraryId: string): Promise<IUser> {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role === Role.LIBRARIAN) {
    throw new ApiError(400, 'User is already a librarian');
  }

  const library = await getLibraryById(libraryId);
  if (!library) {
    throw new ApiError(404, 'Library not found');
  }

  const isAlreadyAssigned = await isUserAssignedToLibrary(userId, libraryId);
  if (isAlreadyAssigned) {
    throw new ApiError(400, 'User is already assigned to this library');
  }

  // First update user role
  const updatedUser = await updateUserRoleInDB(userId, Role.LIBRARIAN);
  if (!updatedUser) {
    throw new ApiError(500, 'Failed to update user role');
  }

  // Then add to library
  const updatedLibrary = await addUserAsLibrarian(userId, libraryId);
  if (!updatedLibrary) {
    // Rollback role change if library update fails
    await updateUserRoleInDB(userId, Role.USER);
    throw new ApiError(500, 'Failed to assign librarian to library');
  }

  return updatedUser;
}

export async function removeUserAsLibrarian(userId: string, libraryId: string): Promise<IUser> {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.role !== Role.LIBRARIAN) {
    throw new ApiError(400, 'User is not a librarian');
  }

  const library = await getLibraryById(libraryId);
  if (!library) {
    throw new ApiError(404, 'Library not found');
  }

  const isAssigned = await isUserAssignedToLibrary(userId, libraryId);
  if (!isAssigned) {
    throw new ApiError(400, 'User is not assigned to this library');
  }

  // First remove from library
  const updatedLibrary = await removeUserAsLibrarianFromDB(userId, libraryId);
  if (!updatedLibrary) {
    throw new ApiError(500, 'Failed to remove librarian from library');
  }

  // Then update role back to user
  const updatedUser = await updateUserRoleInDB(userId, Role.USER);
  if (!updatedUser) {
    throw new ApiError(404, 'User not found');
  }

  return updatedUser;
} 