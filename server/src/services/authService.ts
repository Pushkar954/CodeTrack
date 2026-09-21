import { Schema, model } from 'mongoose';

export interface IUser {
  clerkUserId: string;
  name: string;
  email: string;
  profileImage?: string;
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
  static async syncUser(clerkUserId: string, clerkData: {
    email: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  }): Promise<IUser> {
    const existing = await User.findOne({ clerkUserId }).lean() as IUser | null;
    if (existing) {
      return existing;
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

  static async findByClerkUserId(clerkUserId: string): Promise<IUser | null> {
    const result = await User.findOne({ clerkUserId }).lean() as IUser | null;
    return result;
  }
}
