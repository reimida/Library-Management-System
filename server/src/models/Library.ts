import mongoose, { Schema, Document } from 'mongoose';

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
  contactPhone: string;
  contactEmail: string;
  totalSeats: number;
  isActive: boolean;
  librarians: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

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

const Library = mongoose.model<ILibrary>('Library', LibrarySchema);

export default Library; 