import { Request, Response } from 'express';
import { z } from 'zod';
import { registerUser, loginUser, getUserProfile, updateUserProfile, assignUserAsLibrarian, removeUserAsLibrarian } from '../services/userService';
import { LoginSchema, RegisterSchema, UpdateProfileSchema } from '../validations/authSchemas';
import { asyncHandler } from '../utils/asyncHandler';
import { validateAndExecute, sendSuccess, validateId, executeWithValidation } from '../utils/controllerUtils';
import { BusinessError } from '../utils/errors';
import { ConflictError } from '../utils/errors';

export const register = asyncHandler(async (req: Request, res: Response) => {
  return validateAndExecute(
    req,
    res,
    RegisterSchema,
    async (data) => {
      const user = await registerUser(data);
      return sendSuccess(res, {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }, 'User registered successfully', 201);
    }
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  return validateAndExecute(
    req,
    res,
    LoginSchema,
    async (data) => {
      const loginData = await loginUser(data);
      return sendSuccess(res, loginData, 'Login successful');
    }
  );
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  return executeWithValidation(
    req,
    res,
    () => {
      // Validation logic
      if (!req.user?.userId) {
        throw new BusinessError('Authentication required');
      }
    },
    async () => {
      // Handler logic
      const profile = await getUserProfile(req.user!.userId);
      return sendSuccess(res, profile);
    }
  );
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  return executeWithValidation(
    req,
    res,
    () => {
      // Validation logic
      if (!req.user?.userId) {
        throw new BusinessError('Authentication required');
      }
    },
    async () => {
      // Handler logic
      return validateAndExecute(
        req,
        res,
        UpdateProfileSchema,
        async (data) => {
          const updatedProfile = await updateUserProfile(req.user!.userId, data);
          return sendSuccess(res, {
            user: {
              _id: updatedProfile._id,
              email: updatedProfile.email,
              name: updatedProfile.name,
              role: updatedProfile.role
            }
          }, 'Profile updated successfully');
        }
      );
    }
  );
});

const librarianManagementSchema = z.object({
  libraryId: z.string().min(1, "Library ID is required")
});

export const assignLibrarian = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  return validateAndExecute(
    req,
    res,
    librarianManagementSchema,
    async (data) => {
      validateId(userId, 'user');
      validateId(data.libraryId, 'library');
      const updatedUser = await assignUserAsLibrarian(userId, data.libraryId);
      return sendSuccess(res, {
        message: 'User assigned as librarian successfully',
        data: updatedUser
      });
    }
  );
});

export const removeLibrarian = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  return validateAndExecute(
    req,
    res,
    librarianManagementSchema,
    async (data) => {
      validateId(userId, 'user');
      validateId(data.libraryId, 'library');
      const updatedUser = await removeUserAsLibrarian(userId, data.libraryId);
      return sendSuccess(res, {
        message: 'Librarian role removed successfully',
        data: updatedUser
      });
    }
  );
}); 