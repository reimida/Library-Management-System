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

export const scheduleSchema = z.object({
  schedule: weeklyScheduleSchema,
});

export type ScheduleInput = z.infer<typeof scheduleSchema>;

export const updateScheduleSchema = scheduleSchema.partial(); // For updates

export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;

export const validateScheduleInput = (input: unknown) => scheduleSchema.safeParse(input);
export const validateUpdateScheduleInput = (input: unknown) => updateScheduleSchema.safeParse(input); 