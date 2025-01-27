import { Request, Response } from 'express';
import { UserValidationSchema } from '../models/User';
import { z } from 'zod';
import { registerUser } from '../services/userService';

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = UserValidationSchema.parse(req.body);
    const user = await registerUser(validatedData);

    console.log("Successfully registered user, sending 201 response..."); // Debug log

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 