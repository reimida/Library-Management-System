import mongoose, { Schema, Document } from 'mongoose';

// Operating hours interface (reused from existing Library model)
interface IOperatingHours {
  open: string;   // Format: "HH:mm"
  close: string;  // Format: "HH:mm"
}

// Days of week operating hours (reused)
interface IWeeklySchedule {
  monday: IOperatingHours;
  tuesday: IOperatingHours;
  thursday: IOperatingHours;
  friday: IOperatingHours;
  wednesday: IOperatingHours;
  saturday?: IOperatingHours;
  sunday?: IOperatingHours;
}

export interface ISchedule extends Document {
  libraryId: mongoose.Types.ObjectId;
  schedule: IWeeklySchedule;
  createdAt?: Date;
  updatedAt?: Date;
}

const OperatingHoursSchema = new Schema({
  open: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
      message: 'Operating hours must be in HH:mm format'
    }
  },
  close: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
      message: 'Operating hours must be in HH:mm format'
    }
  }
}, { _id: false });

const ScheduleSchema: Schema = new Schema(
  {
    libraryId: {
      type: Schema.Types.ObjectId,
      ref: 'Library',
      required: true,
      unique: true // Ensure one schedule per library
    },
    schedule: {
      monday: { type: OperatingHoursSchema, required: true },
      tuesday: { type: OperatingHoursSchema, required: true },
      wednesday: { type: OperatingHoursSchema, required: true },
      thursday: { type: OperatingHoursSchema, required: true },
      friday: { type: OperatingHoursSchema, required: true },
      saturday: OperatingHoursSchema,
      sunday: OperatingHoursSchema
    },
  },
  { timestamps: true }
);

const Schedule = mongoose.model<ISchedule>('Schedule', ScheduleSchema);

export default Schedule; 