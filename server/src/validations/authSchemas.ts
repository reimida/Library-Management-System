import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(3, 'Name must be at least 3 characters')
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  // Add more editable fields here as needed
  // Example: bio, phoneNumber, etc.
}).partial(); // Makes all fields optional for partial updates

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>; 