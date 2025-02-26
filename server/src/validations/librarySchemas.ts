import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required')
});

const baseLibrarySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  libraryCode: z.string().min(1, 'Library code is required').max(10),
  address: addressSchema,
  contactPhone: z.string().regex(/^\+?[\d\s-]+$/, 'Invalid phone number format'),
  contactEmail: z.string().email('Invalid email format'),
  totalSeats: z.number().int().positive('Total seats must be a positive number'),
  isActive: z.boolean().optional()
});

export type LibraryInput = z.infer<typeof baseLibrarySchema>;

export const librarySchema = baseLibrarySchema.transform((data) => ({
  ...data,
  isActive: data.isActive === undefined ? true : data.isActive
}));

export const updateLibrarySchema = baseLibrarySchema.partial();

export const validateLibraryInput = (input: unknown) => librarySchema.safeParse(input);
export const validateUpdateLibraryInput = (input: unknown) => updateLibrarySchema.safeParse(input);