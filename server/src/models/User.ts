import mongoose, { Schema, model, Document } from 'mongoose';
import { config } from '../config/config.js';

export interface IUser extends Document {
  clerkUserId: string;
  name: string;
  email: string;
  profileImage?: string;
  _id: string;
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

export class AuthService {
  static async findByClerkUserId(clerkUserId: string): Promise<IUser | null> {
    return User.findOne({ clerkUserId }).lean() as Promise<IUser | null>;
  }

  static async findOrCreate(clerkUserId: string, clerkData: {
    email: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  }): Promise<IUser> {
    const existing = await User.findOne({ clerkUserId }).lean();
    if (existing) {
      return existing as IUser;
    }

    const name = `${clerkData.firstName || ''} ${clerkData.lastName || ''}`.trim() || clerkData.email;
    const newUser = await User.create({
      clerkUserId,
      name,
      email: clerkData.email,
      profileImage: clerkData.profileImageUrl,
    });
    return newUser as IUser;
  }
}
