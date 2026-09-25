import { IGoal, GoalStatus } from '@goalforge/shared';
import { Goal } from '../models/Goal.js';
import { SortOrder } from 'mongoose';

export interface IGoalRepository {
  create(data: Partial<IGoal>): Promise<IGoal>;
  findById(id: string): Promise<IGoal | null>;
  findByUser(userId: string, options?: { page?: number; limit?: number; status?: string; sortBy?: string; sortOrder?: string }): Promise<{ goals: IGoal[]; total: number; page: number; totalPages: number }>;
  findByIdAndUser(id: string, userId: string): Promise<IGoal | null>;
  update(id: string, data: Partial<IGoal>): Promise<IGoal | null>;
  archive(id: string, userId: string): Promise<boolean>;
  countByUser(userId: string, status?: string): Promise<number>;
}

export class GoalRepository {
  constructor(private model: typeof Goal) {}

  async create(data: Partial<IGoal>): Promise<IGoal> {
    const doc = await this.model.create(data);
    return this.toIGoal(doc);
  }

  async findById(id: string): Promise<IGoal | null> {
    const doc = await this.model.findById(id).lean();
    return doc ? this.toIGoal(doc) : null;
  }

  async findByUser(userId: string, options: { page?: number; limit?: number; status?: string; sortBy?: string; sortOrder?: string } = {}): Promise<{ goals: IGoal[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 20, status, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = { userId };
    if (status) filter.status = status;

    const sort: Record<string, SortOrder> = {};
    const allowedSortFields = ['createdAt', 'updatedAt', 'startDate', 'endDate', 'title', 'status', 'category'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sort[sortField] = sortOrder === 'asc' ? 1 : -1;

    const [goals, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      this.model.countDocuments(filter).lean(),
    ]);

    return { goals: goals as IGoal[], total, page, totalPages: Math.ceil(total / limit) };
  }

  async findByIdAndUser(id: string, userId: string): Promise<IGoal | null> {
    const doc = await this.model.findOne({ _id: id, userId }).lean();
    return doc ? this.toIGoal(doc) : null;
  }

  async update(id: string, data: Partial<IGoal>): Promise<IGoal | null> {
    const doc = await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    return doc ? this.toIGoal(doc) : null;
  }

  async archive(id: string, userId: string): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(
      { _id: id, userId },
      { status: GoalStatus.ARCHIVED, archivedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
    return result !== null;
  }

  async countByUser(userId: string, status?: string): Promise<number> {
    const filter: Record<string, unknown> = { userId };
    if (status) filter.status = status;
    return this.model.countDocuments(filter).lean() as Promise<number>;
  }

  private toIGoal(doc: unknown): IGoal {
    const data = doc as Record<string, unknown>;
    return {
      ...data,
      userId: String(data.userId || ''),
    } as IGoal;
  }
}
