import { Request, Response } from 'express';
import { z } from 'zod';
import { registerUser, loginUser, getUserProfile, updateUserProfile, assignUserAsLibrarian, removeUserAsLibrarian } from '../services/userService';
import { LoginSchema, RegisterSchema, UpdateProfileSchema } from '../validations/authSchemas';
import { asyncHandler } from '../utils/asyncHandler';
import { validateAndExecute, sendSuccess, validateId } from '../utils/controllerUtils';
import { BusinessError } from '../utils/errors';
import { ConflictError } from '../utils/errors';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const userData = await validateAndExecute(
    req,
    res,
    RegisterSchema,
    async (data) => {
      const user = await registerUser(data);
      return {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    }
  );

  if (userData) {
    return sendSuccess(res, userData, 'User registered successfully', 201);
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const loginData = await validateAndExecute(
    req,
    res,
    LoginSchema,
    async (data) => {
      return await loginUser(data);
    }
  );

  if (loginData) {
    return sendSuccess(res, loginData, 'Login successful');
  }
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    throw new BusinessError('Authentication required');
  }

  const profile = await getUserProfile(req.user.userId);
  return sendSuccess(res, profile);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    throw new BusinessError('Authentication required');
  }

  const updatedData = await validateAndExecute(
    req,
    res,
    UpdateProfileSchema,
    async (data) => {
      const updatedProfile = await updateUserProfile(req.user!.userId, data);
      return {
        user: {
          _id: updatedProfile._id,
          email: updatedProfile.email,
          name: updatedProfile.name,
          role: updatedProfile.role
        }
      };
    }
  );

  if (updatedData) {
    return sendSuccess(res, updatedData, 'Profile updated successfully');
  }
});

const librarianManagementSchema = z.object({
  libraryId: z.string().min(1, "Library ID is required")
});

export const assignLibrarian = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  validateId(userId, 'user');

  const result = await validateAndExecute(
    req,
    res,
    librarianManagementSchema,
    async (data) => {
      validateId(data.libraryId, 'library');
      try {
        const updatedUser = await assignUserAsLibrarian(userId, data.libraryId);
        return {
          message: 'User assigned as librarian successfully',
          data: updatedUser
        };
      } catch (error) {
        if (error instanceof ConflictError) {
          res.status(409).json({
            success: false,
            message: error.message
          });
          return null;
        }
        throw error;
      }
    }
  );

  if (result) {
    return sendSuccess(res, result);
  }
});

export const removeLibrarian = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  validateId(userId, 'user');

  const result = await validateAndExecute(
    req,
    res,
    librarianManagementSchema,
    async (data) => {
      validateId(data.libraryId, 'library');
      const updatedUser = await removeUserAsLibrarian(userId, data.libraryId);
      return {
        message: 'Librarian role removed successfully',
        data: updatedUser
      };
    }
  );

  if (result) {
    return sendSuccess(res, result);
  }
}); 