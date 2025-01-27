import mongoose from 'mongoose';

// Single source of truth for user fields
const userFields = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['USER', 'LIBRARIAN', 'ADMIN'], default: 'USER' }
} as const;

// Mongoose schema for DB
const userSchema = new mongoose.Schema(userFields, { timestamps: true });

// Types
export type User = mongoose.InferSchemaType<typeof userSchema>;

// Model
export const UserModel = mongoose.model<User>('User', userSchema);