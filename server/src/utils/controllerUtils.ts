import { Request, Response } from 'express';
import { z } from 'zod';
import { ApiError } from './apiError';

export function handleControllerError(error: unknown, res: Response) {
  if (error instanceof z.ZodError) 
    return res.status(400).json({ 
      success: false,
      errors: error.errors.map(err => err.message)
    });
  
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ 
      success: false,
      errors: [error.message]
    });
  }
  
  if (error instanceof Error) {
    if (error.message === 'Invalid credentials')
      return res.status(401).json({ 
        success: false,
        errors: ['Invalid email or password']
      });
    
    console.error('Controller error:', error);
  }
  
  return res.status(500).json({ 
    success: false,
    errors: ['Internal server error']
  });
}

export async function validateAndExecute<T, R>(
  req: Request,
  res: Response,
  schema: z.ZodSchema<T>,
  handler: (data: T) => Promise<R>,
  successStatus = 200
) {
  try {
    const validatedData = schema.parse(req.body);
    const result = await handler(validatedData);
    return res.status(successStatus).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.errors.map(err => err.message)
      });
    }
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        errors: [error.message]
      });
    }
    return handleControllerError(error, res);
  }
} 