import { z } from 'zod';

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

export const seatSchema = z.object({
  code: z.string().min(1, 'Seat code is required'),
  floor: z.string().min(1, 'Floor is required'),
  area: z.string().min(1, 'Area is required'),
  status: z.enum([SeatStatus.AVAILABLE, SeatStatus.RESERVED, SeatStatus.OUT_OF_SERVICE])
    .default(SeatStatus.AVAILABLE)
});

export type SeatInput = z.infer<typeof seatSchema>;

// This ensures the status is always defined in the input
export type CreateSeatInput = Required<SeatInput>;
// For updates, all fields including status are optional
export type UpdateSeatInput = Partial<SeatInput>;

export function validateSeatInput<T extends boolean>(
  data: unknown,
  partial: T
): Promise<T extends true ? UpdateSeatInput : CreateSeatInput> {
  const schema = partial ? seatSchema.partial() : seatSchema;
  return schema.parseAsync(data) as Promise<T extends true ? UpdateSeatInput : CreateSeatInput>;
} 