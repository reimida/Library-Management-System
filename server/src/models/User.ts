import mongoose from 'mongoose';
import { z } from 'zod';

// Single source of truth for user fields
const userFields = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['USER', 'LIBRARIAN', 'ADMIN'], default: 'USER' }
} as const;

// Mongoose schema for DB
const userSchema = new mongoose.Schema(userFields, { timestamps: true });

// Zod schema for validation - derives from the same fields as mongoose
export const UserValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(3),
  // role is not included since it's set by default
});

// Types
export type UserInput = z.infer<typeof UserValidationSchema>;
export type User = mongoose.InferSchemaType<typeof userSchema>;

// Model
export const UserModel = mongoose.model<User>('User', userSchema);