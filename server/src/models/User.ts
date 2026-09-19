import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  clerkUserId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: { type: String },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
