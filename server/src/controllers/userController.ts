import { Request, Response } from 'express';
import { z } from 'zod';
import { registerUser, loginUser } from '../services/userService';
import { LoginSchema, RegisterSchema } from '../validations/authSchemas';

// Common error handler
function handleControllerError(error: unknown, res: Response) {
  if (error instanceof z.ZodError) 
    return res.status(400).json({ errors: error.errors });
  
  if (error instanceof Error) {
    if (error.message === 'Invalid credentials')
      return res.status(401).json({ message: 'Invalid email or password' });
    
    console.error('Controller error:', error);
  }
  
  return res.status(500).json({ message: 'Internal server error' });
}

// Generic validation handler
async function validateAndExecute<T, R>(
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
    handleControllerError(error, res);
  }
}

export const register = async (req: Request, res: Response) => {
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
};

export const login = async (req: Request, res: Response) => {
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
}; 