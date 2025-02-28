import { z } from 'zod';
import { ReservationStatus } from '../models/Reservation';

export const ReservationSchema = z.object({
  seatId: z.string().min(1, 'Seat ID is required'),
  startTime: z.string().datetime(), // Enforce ISO 8601 datetime format
  endTime: z.string().datetime()
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
});

// Schema for filtering reservations
export const ReservationFilterSchema = z.object({
  status: z.enum([ReservationStatus.ACTIVE, ReservationStatus.CANCELLED, ReservationStatus.COMPLETED]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});

export type ReservationInput = z.infer<typeof ReservationSchema>;
export type ReservationFilterInput = z.infer<typeof ReservationFilterSchema>;

//export type UpdateReservationInput = z.infer<typeof UpdateReservationSchema>; 