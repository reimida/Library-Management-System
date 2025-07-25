import mongoose, { Schema, Document } from 'mongoose';
import { Role } from '../types/auth';

// Define the User interface that extends Mongoose Document
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the User schema
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: Object.values(Role), 
      default: Role.USER 
    },
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;