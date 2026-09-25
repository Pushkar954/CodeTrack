import { Schema, Document, model } from 'mongoose';
import { GoalStatus } from '@goalforge/shared';
import { IGoalDocument } from '@goalforge/shared';

export type { IGoalDocument, GoalStatus } from '@goalforge/shared';

const goalSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, maxlength: 2000, default: '' },
  category: { type: String, required: true, index: true },
  currentLevel: { type: String, required: true, index: true },
  targetLevel: { type: String, required: true, index: true },
  durationDays: { type: Number, required: true, min: 1 },
  dailyStudyMinutes: { type: Number, required: true, min: 5, max: 480 },
  preferredLanguage: { type: String, required: true },
  preferredPlatform: { type: String, required: true },
  status: { type: String, enum: Object.values(GoalStatus), required: true, default: GoalStatus.DRAFT, index: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  startDate: { type: Date },
  endDate: { type: Date },
  archivedAt: { type: Date },
}, { timestamps: true });

goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ userId: 1, category: 1 });
goalSchema.index({ userId: 1, createdAt: 1 });
goalSchema.index({ userId: 1, startDate: 1 });

export const Goal = model<IGoalDocument & Document>('Goal', goalSchema);
