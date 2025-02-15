import { Request, Response } from 'express';
import { Types } from 'mongoose';
import * as libraryService from '../services/libraryService';
import { validateLibraryInput } from '../validations/librarySchemas';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import { ZodError } from 'zod';

export const createLibrary = asyncHandler(async (req: Request, res: Response) => {
  try {
    const validatedData = await validateLibraryInput(req.body, false);
    const library = await libraryService.createLibrary(validatedData);
    
    res.status(201).json({
      success: true,
      data: library
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        error: error.errors
      });
      return;
    }
    throw error; // Let the global error handler handle other errors
  }
});

export const getLibrary = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  
  try {
    new Types.ObjectId(libraryId);
  } catch (error) {
    throw new ApiError(400, 'Invalid library ID format');
  }

  const library = await libraryService.getLibrary(libraryId);
  
  res.json({
    success: true,
    data: library
  });
});

export const listLibraries = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive = req.query.includeInactive === 'true';
  const libraries = await libraryService.listLibraries({ includeInactive });
  
  res.json({
    success: true,
    data: libraries
  });
});

export const updateLibrary = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  
  try {
    new Types.ObjectId(libraryId);
  } catch (error) {
    throw new ApiError(400, 'Invalid library ID format');
  }

  const validatedData = await validateLibraryInput(req.body, true);
  const library = await libraryService.updateLibrary(libraryId, validatedData);
  
  if (!library) {
    throw new ApiError(404, 'Library not found');
  }

  res.json({
    success: true,
    data: library
  });
});

export const deleteLibrary = asyncHandler(async (req: Request, res: Response) => {
  const { libraryId } = req.params;
  
  try {
    new Types.ObjectId(libraryId);
  } catch (error) {
    throw new ApiError(400, 'Invalid library ID format');
  }

  await libraryService.deleteLibrary(libraryId);
  
  res.json({
    success: true,
    message: 'Library deleted successfully'
  });
}); 