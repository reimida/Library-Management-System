import mongoose, { Schema, Document } from 'mongoose';

// Operating hours interface for type safety
interface IOperatingHours {
  open: string;   // Format: "HH:mm"
  close: string;  // Format: "HH:mm"
}

// Days of week operating hours
interface IWeeklySchedule {
  monday: IOperatingHours;
  tuesday: IOperatingHours;
  wednesday: IOperatingHours;
  thursday: IOperatingHours;
  friday: IOperatingHours;
  saturday?: IOperatingHours;
  sunday?: IOperatingHours;
}

export interface ILibrary extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  libraryCode: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  operatingHours: IWeeklySchedule;
  contactPhone: string;
  contactEmail: string;
  totalSeats: number;
  isActive: boolean;
  librarians: mongoose.Types.ObjectId[];
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

const LibrarySchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    libraryCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: 10
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    },
    operatingHours: {
      monday: { type: OperatingHoursSchema, required: true },
      tuesday: { type: OperatingHoursSchema, required: true },
      wednesday: { type: OperatingHoursSchema, required: true },
      thursday: { type: OperatingHoursSchema, required: true },
      friday: { type: OperatingHoursSchema, required: true },
      saturday: OperatingHoursSchema,
      sunday: OperatingHoursSchema
    },
    contactPhone: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^\+?[\d\s-]+$/.test(v),
        message: 'Invalid phone number format'
      }
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      validate: {
        validator: (v: string) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
        message: 'Invalid email format'
      }
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1
    },
    isActive: {
      type: Boolean,
      default: true
    },
    librarians: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for getting current status (open/closed)
LibrarySchema.virtual('isOpen').get(function(this: ILibrary) {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  
  const todayHours = this.operatingHours[day as keyof IWeeklySchedule];
  if (!todayHours) return false;
  
  return time >= todayHours.open && time <= todayHours.close;
});

const Library = mongoose.model<ILibrary>('Library', LibrarySchema);

export default Library; 