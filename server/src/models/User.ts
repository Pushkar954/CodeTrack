import { Schema, model } from 'mongoose';

export interface IUser {
  clerkUserId: string;
  name: string;
  email: string;
  profileImage?: string;
  _id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  clerkUserId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: { type: String },
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);
