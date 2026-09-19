import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, maxlength: 500, default: '' },
  topic: { type: String, required: true, index: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true, default: 'Medium' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true, default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], required: true, default: 'Pending', index: true },
  deadline: { type: Date },
  problemUrl: { type: String, default: '' },
  notes: { type: String, default: '' },
  completedAt: { type: Date },
}, { timestamps: true });

taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, topic: 1 });
taskSchema.index({ userId: 1, difficulty: 1 });
taskSchema.index({ userId: 1, deadline: 1 });

export const Task = mongoose.model('Task', taskSchema);
