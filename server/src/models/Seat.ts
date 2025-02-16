import mongoose, { Schema, Document } from 'mongoose';
import { SeatStatus } from '../validations/seatSchemas';

export interface ISeat extends Document {
  code: string;
  floor: string;
  area: string;
  status: typeof SeatStatus[keyof typeof SeatStatus];
  libraryId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const seatSchema = new Schema<ISeat>(
  {
    code: {
      type: String,
      required: true,
      trim: true
    },
    floor: {
      type: String,
      required: true,
      trim: true
    },
    area: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: Object.values(SeatStatus),
      default: SeatStatus.AVAILABLE
    },
    libraryId: {
      type: Schema.Types.ObjectId,
      ref: 'Library',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure unique seat codes within a library
seatSchema.index({ libraryId: 1, code: 1 }, { unique: true });

export const Seat = mongoose.model<ISeat>('Seat', seatSchema); 