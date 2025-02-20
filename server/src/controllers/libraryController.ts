import { Request, Response } from 'express';
import { Types } from 'mongoose';
import * as libraryService from '../services/libraryService';
import { librarySchema, validateLibraryInput, updateLibrarySchema } from '../validations/librarySchemas';
import { asyncHandler } from '../utils/asyncHandler';
import { ZodError } from 'zod';
import { validateAndExecute, sendSuccess, validateId } from '../utils/controllerUtils';

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
  validateId(libraryId, 'library');
  
  const library = await libraryService.getLibrary(libraryId);
  return sendSuccess(res, library);
});

export const listLibraries = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive = req.query.includeInactive === 'true';
  const libraries = await libraryService.listLibraries({ includeInactive });
  
  return sendSuccess(res, libraries);
});

export const updateLibrary = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  validateId(libraryId, 'library');

  const library = await validateAndExecute(
    req,
    res,
    updateLibrarySchema,
    async (data) => {
      return await libraryService.updateLibrary(libraryId, data);
    }
  );

  if (library) {
    return sendSuccess(res, library, 'Library updated successfully');
  }
});

export const deleteLibrary = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  validateId(libraryId, 'library');
  
  await libraryService.deleteLibrary(libraryId);
  return sendSuccess(res, null, 'Library deleted successfully', 204);
}); 