import mongoose, { Schema, Document } from 'mongoose';

export enum ReservationStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface IReservation extends Document {
  userId: mongoose.Types.ObjectId;
  seatId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReservationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    seatId: {
      type: Schema.Types.ObjectId,
      ref: 'Seat',
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(ReservationStatus),
      default: ReservationStatus.ACTIVE
    }
  },
  { timestamps: true }
);

const Reservation = mongoose.model<IReservation>('Reservation', ReservationSchema);

export default Reservation; 