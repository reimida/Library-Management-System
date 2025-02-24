import { Request, Response } from 'express';
import { z } from 'zod';
import { BusinessError, NotFoundError, ConflictError } from './errors';

export function handleControllerError(error: unknown, res: Response) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      errors: error.errors.map(err => err.message)
    });
  }
  
  if (error instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }

  if (error instanceof ConflictError) {
    return res.status(409).json({
      success: false,
      message: error.message
    });
  }

  // Authorization errors should be 403
  if (error instanceof BusinessError && 
      (error.message.toLowerCase().includes('not authorized') ||
       error.message.toLowerCase().includes('unauthorized'))) {
    return res.status(403).json({
      success: false,
      message: error.message
    });
  }

  if (error instanceof BusinessError) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Only log errors in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    console.error('Controller error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}

export async function validateAndExecute<T>(
  req: Request,
  res: Response,
  schema: z.ZodSchema<T>,
  handler: (data: T) => Promise<any>
) {
  try {
    const validatedData = schema.parse(req.body);
    return await handler(validatedData);
  } catch (error) {
    handleControllerError(error, res);
    return null;
  }
}

export function sendSuccess(
  res: Response, 
  data: any = null, 
  message: string = 'Success', 
  statusCode: number = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

// Generic ID validation schema
export const idSchema = z.string().min(1, "ID is required");

// Separate MongoDB-specific validation
export const mongoIdSchema = z.string().regex(
  /^[0-9a-fA-F]{24}$/,
  'Invalid MongoDB ID format'
);

// Generic ID validation
export function validateId(id: string, entityName: string, schema: z.ZodSchema = idSchema) {
  const result = schema.safeParse(id);
  if (!result.success) {
    throw new BusinessError(`Invalid ${entityName} ID format`);
  }
}

// MongoDB-specific ID validation
export function validateMongoId(id: string, entityName: string) {
  validateId(id, entityName, mongoIdSchema);
} 