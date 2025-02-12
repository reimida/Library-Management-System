import { Request, Response } from 'express';
import { Types } from 'mongoose';
import * as libraryService from '../services/libraryService';
import { validateLibraryInput } from '../validations/librarySchemas';
import { ApiError } from '../utils/ApiError';
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
  const { id } = req.params;
  
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid library ID format');
  }

  const library = await libraryService.getLibrary(id);
  
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
  const { id } = req.params;
  
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid library ID format');
  }

  const validatedData = await validateLibraryInput(req.body, true);
  const library = await libraryService.updateLibrary(id, validatedData);
  
  res.json({
    success: true,
    data: library
  });
});

export const deleteLibrary = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid library ID format');
  }

  await libraryService.deleteLibrary(id);
  
  res.json({
    success: true,
    message: 'Library deleted successfully'
  });
});

export const toggleLibraryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;
  
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid library ID format');
  }

  if (typeof isActive !== 'boolean') {
    throw new ApiError(400, 'isActive must be a boolean value');
  }

  const library = await libraryService.toggleLibraryStatus(id, isActive);
  
  res.json({
    success: true,
    data: library
  });
});

export const getLibraryByCode = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params;
  
  if (!code || typeof code !== 'string') {
    throw new ApiError(400, 'Library code is required');
  }

  const library = await libraryService.getLibraryByCode(code);
  
  if (!library) {
    throw new ApiError(404, 'Library not found');
  }

  res.json({
    success: true,
    data: library
  });
}); 