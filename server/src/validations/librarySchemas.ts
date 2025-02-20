import { z } from 'zod';

const operatingHoursSchema = z.object({
  open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format. Use HH:mm'),
  close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format. Use HH:mm')
});

const weeklyScheduleSchema = z.object({
  monday: operatingHoursSchema,
  tuesday: operatingHoursSchema,
  wednesday: operatingHoursSchema,
  thursday: operatingHoursSchema,
  friday: operatingHoursSchema,
  saturday: operatingHoursSchema.optional(),
  sunday: operatingHoursSchema.optional()
});

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required')
});

// Base schema type that matches what we expect
const baseLibrarySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  libraryCode: z.string().min(1, 'Library code is required').max(10),
  address: addressSchema,
  operatingHours: weeklyScheduleSchema,
  contactPhone: z.string().regex(/^\+?[\d\s-]+$/, 'Invalid phone number format'),
  contactEmail: z.string().email('Invalid email format'),
  totalSeats: z.number().int().positive('Total seats must be a positive number'),
  isActive: z.boolean().optional()
});

// Export the type that includes the optional isActive
export type LibraryInput = z.infer<typeof baseLibrarySchema>;

// Create the validation schema that enforces the default
export const librarySchema = baseLibrarySchema.transform((data) => ({
  ...data,
  isActive: data.isActive === undefined ? true : data.isActive
}));

// Update schema uses the base schema
export const updateLibrarySchema = baseLibrarySchema.partial();

export const validateLibraryInput = (input: unknown) => librarySchema.safeParse(input);
export const validateUpdateLibraryInput = (input: unknown) => updateLibrarySchema.safeParse(input);