import { Request, Response } from 'express';
import { Types } from 'mongoose';
import * as libraryService from '../services/libraryService';
import { librarySchema, validateLibraryInput, updateLibrarySchema } from '../validations/librarySchemas';
import { asyncHandler } from '../utils/asyncHandler';
import { ZodError } from 'zod';
import { validateAndExecute, sendSuccess, validateId, executeWithValidation } from '../utils/controllerUtils';

export const createLibrary = asyncHandler(async (req: Request, res: Response) => {
  return validateAndExecute(
    req,
    res,
    librarySchema,
    async (data) => {
      const library = await libraryService.createLibrary(data);
      return sendSuccess(res, library, 'Library created successfully', 201);
    }
  );
});

export const getLibrary = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  
  return executeWithValidation(
    req,
    res,
    () => {
      // Validation logic
      validateId(libraryId, 'library');
    },
    async () => {
      // Handler logic
      const library = await libraryService.getLibrary(libraryId);
      return sendSuccess(res, library);
    }
  );
});

export const listLibraries = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive = req.query.includeInactive === 'true';
  
  return executeWithValidation(
    req,
    res,
    () => {
      // No validation needed for this endpoint
    },
    async () => {
      // Handler logic
      const libraries = await libraryService.listLibraries({ includeInactive });
      return sendSuccess(res, libraries);
    }
  );
});

export const updateLibrary = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  
  return validateAndExecute(
    req,
    res,
    updateLibrarySchema,
    async (data) => {
      validateId(libraryId, 'library');
      const updatedLibrary = await libraryService.updateLibrary(libraryId, data);
      return sendSuccess(res, updatedLibrary, 'Library updated successfully');
    }
  );
});

export const deleteLibrary = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  
  return executeWithValidation(
    req,
    res,
    () => {
      // Validation logic
      validateId(libraryId, 'library');
    },
    async () => {
      // Handler logic
      await libraryService.deleteLibrary(libraryId);
      return sendSuccess(res, null, 'Library deleted successfully', 204);
    }
  );
}); 