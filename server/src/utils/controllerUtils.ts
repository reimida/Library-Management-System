import { Request, Response } from 'express';
import { z } from 'zod';
import { ApiError } from './apiError';

export function handleControllerError(error: unknown, res: Response) {
  if (error instanceof z.ZodError) 
    return res.status(400).json({ message: error.errors[0].message });
  
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  
  if (error instanceof Error) {
    if (error.message === 'Invalid credentials')
      return res.status(401).json({ message: 'Invalid email or password' });
    
    console.error('Controller error:', error);
  }
  
  return res.status(500).json({ message: 'Internal server error' });
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
    return handleControllerError(error, res);
  }
} 