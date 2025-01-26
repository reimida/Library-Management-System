import { Request, Response } from "express";
import { UserSchema } from "../models/User";
import { createUser } from "../services/userService";

export async function register(req: Request, res: Response) {
  try {
    // Validate request body
    const validatedData = UserSchema.omit({ 
      id: true, 
      role: true, 
      createdAt: true, 
      updatedAt: true 
    }).parse(req.body);

    const user = await createUser(validatedData);
    return res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
} 