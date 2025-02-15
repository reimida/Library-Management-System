import { Request, Response } from 'express';
import { z } from 'zod';
import { registerUser, loginUser, getUserProfile, updateUserProfile, assignUserAsLibrarian, removeUserAsLibrarian } from '../services/userService';
import { LoginSchema, RegisterSchema, UpdateProfileSchema } from '../validations/authSchemas';
import { asyncHandler } from '../utils/asyncHandler';
import { validateAndExecute } from '../utils/controllerUtils';

export const register = asyncHandler(async (req: Request, res: Response) => {
  return validateAndExecute(
    req,
    res,
    RegisterSchema,
    async (data) => {
      const user = await registerUser(data);
      return {
        message: 'User registered successfully',
        user: {
          email: user.email,
          name: user.name
        }
      };
    },
    201
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  return validateAndExecute(
    req,
    res,
    LoginSchema,
    async (data) => {
      const { user, token } = await loginUser(data);
      return {
        message: 'Login successful',
        token,
        user: {
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    }
  );
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const profile = await getUserProfile(req.user.userId);
  return res.json(profile);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  return validateAndExecute(
    req,
    res,
    UpdateProfileSchema,
    async (data) => {
      const updatedProfile = await updateUserProfile(req.user!.userId, data);
      return {
        message: 'Profile updated successfully',
        user: updatedProfile
      };
    }
  );
});

const librarianManagementSchema = z.object({
  libraryId: z.string().min(1, "Library ID is required")
});

export const assignLibrarian = asyncHandler(async (req: Request, res: Response) => {
  return validateAndExecute(
    req,
    res,
    librarianManagementSchema,
    async (data) => {
      const { userId } = req.params;
      const updatedUser = await assignUserAsLibrarian(userId, data.libraryId);
      return {
        message: 'User assigned as librarian successfully',
        data: updatedUser
      };
    }
  );
});

export const removeLibrarian = asyncHandler(async (req: Request, res: Response) => {
  return validateAndExecute(
    req,
    res,
    librarianManagementSchema,
    async (data) => {
      const { userId } = req.params;
      const updatedUser = await removeUserAsLibrarian(userId, data.libraryId);
      return {
        message: 'Librarian role removed successfully',
        data: updatedUser
      };
    }
  );
}); 