import { AppError } from '../errors/appError.js';
import {
  NotFoundError,
  BadRequestError,
} from '../errors/appError.js';
import { ERROR_CODES, GoalStatus, MAX_DAILY_STUDY_MINUTES, MIN_DAILY_STUDY_MINUTES } from '@goalforge/shared';
import { IGoal } from '@goalforge/shared';
import { GoalRepository } from '../repositories/goalRepository.js';
import { AuthService } from './authService.js';

export class GoalService {
  constructor(
    private repository: GoalRepository,
    private authService: typeof AuthService
  ) {}

  async createGoal(clerkUserId: string, data: Partial<IGoal>): Promise<IGoal> {
    const user = await this.authService.findByClerkUserId(clerkUserId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    this.validateBusinessRules(data, undefined);

    const goalData: Partial<IGoal> = {
      userId: user._id,
      title: data.title!.trim(),
      description: data.description?.trim() || '',
      category: data.category!,
      currentLevel: data.currentLevel!,
      targetLevel: data.targetLevel!,
      durationDays: data.durationDays!,
      dailyStudyMinutes: data.dailyStudyMinutes!,
      preferredLanguage: data.preferredLanguage!,
      preferredPlatform: data.preferredPlatform!,
      status: data.status || GoalStatus.DRAFT,
      progress: data.progress || 0,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    return this.repository.create(goalData);
  }

  async listGoals(clerkUserId: string, options: { page?: number; limit?: number; status?: string; sortBy?: string; sortOrder?: string } = {}): Promise<{ goals: IGoal[]; total: number; page: number; totalPages: number }> {
    const user = await this.authService.findByClerkUserId(clerkUserId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.repository.findByUser(user._id, options);
  }

  async getGoalById(id: string, clerkUserId: string): Promise<IGoal> {
    const user = await this.authService.findByClerkUserId(clerkUserId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const goal = await this.repository.findByIdAndUser(id, user._id);
    if (!goal) {
      throw new NotFoundError('Goal not found');
    }
    return goal;
  }

  async updateGoal(id: string, clerkUserId: string, data: Partial<IGoal>): Promise<IGoal> {
    const user = await this.authService.findByClerkUserId(clerkUserId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const existing = await this.repository.findByIdAndUser(id, user._id);
    if (!existing) {
      throw new NotFoundError('Goal not found');
    }

    this.validateBusinessRules(data, existing);

    const allowedFields = ['title', 'description', 'category', 'currentLevel', 'targetLevel', 'durationDays', 'dailyStudyMinutes', 'preferredLanguage', 'preferredPlatform', 'startDate', 'endDate'];
    const updateData: Partial<IGoal> = {};
    for (const field of allowedFields) {
      const value = (data as Record<string, unknown>)[field];
      if (value !== undefined) {
        (updateData as Record<string, unknown>)[field] = value;
      }
    }

    const result = await this.repository.update(id, updateData);
    if (!result) {
      throw new NotFoundError('Goal not found');
    }
    return result;
  }

  async archiveGoal(id: string, clerkUserId: string): Promise<boolean> {
    const user = await this.authService.findByClerkUserId(clerkUserId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const existing = await this.repository.findByIdAndUser(id, user._id);
    if (!existing) {
      throw new NotFoundError('Goal not found');
    }

    if (existing.status === GoalStatus.ARCHIVED) {
      throw new AppError({
        message: 'Goal is already archived',
        code: ERROR_CODES.GOAL_ALREADY_ARCHIVED,
        statusCode: 409,
      });
    }

    return this.repository.archive(id, user._id);
  }

  async changeStatus(id: string, clerkUserId: string, newStatus: GoalStatus): Promise<IGoal> {
    const user = await this.authService.findByClerkUserId(clerkUserId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const existing = await this.repository.findByIdAndUser(id, user._id);
    if (!existing) {
      throw new NotFoundError('Goal not found');
    }

    const allowedTransitions: Record<string, string[]> = {
      [GoalStatus.DRAFT]: [GoalStatus.ACTIVE],
      [GoalStatus.ACTIVE]: [GoalStatus.PAUSED, GoalStatus.COMPLETED, GoalStatus.ARCHIVED],
      [GoalStatus.PAUSED]: [GoalStatus.ACTIVE, GoalStatus.ARCHIVED],
      [GoalStatus.COMPLETED]: [GoalStatus.ARCHIVED],
      [GoalStatus.ARCHIVED]: [],
    };

    const validTargets = allowedTransitions[existing.status];
    if (!validTargets || !validTargets.includes(newStatus)) {
      throw new AppError({
        message: `Cannot transition from ${existing.status} to ${newStatus}`,
        code: ERROR_CODES.GOAL_INVALID_STATE,
        statusCode: 409,
      });
    }

    const result = await this.repository.update(id, { status: newStatus });
    if (!result) {
      throw new NotFoundError('Goal not found');
    }
    return result;
  }

  private validateBusinessRules(data: Partial<IGoal>, existing?: IGoal): void {
    if (data.endDate && data.startDate && new Date(data.endDate) < new Date(data.startDate)) {
      throw new BadRequestError('End date cannot be before start date');
    }

    if (data.durationDays !== undefined && data.durationDays <= 0) {
      throw new BadRequestError('Duration must be a positive number');
    }

    if (data.dailyStudyMinutes !== undefined && (data.dailyStudyMinutes < MIN_DAILY_STUDY_MINUTES || data.dailyStudyMinutes > MAX_DAILY_STUDY_MINUTES)) {
      throw new BadRequestError(`Daily study minutes must be between ${MIN_DAILY_STUDY_MINUTES} and ${MAX_DAILY_STUDY_MINUTES}`);
    }

    if (data.progress !== undefined && (data.progress < 0 || data.progress > 100)) {
      throw new BadRequestError('Progress must be between 0 and 100');
    }

    if (data.targetLevel && data.currentLevel) {
      const levelOrder = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'INTERVIEW_READY'];
      const currentIdx = levelOrder.indexOf(data.currentLevel);
      const targetIdx = levelOrder.indexOf(data.targetLevel);
      if (currentIdx >= targetIdx && currentIdx !== -1 && targetIdx !== -1) {
        throw new BadRequestError('Target level must be higher than current level');
      }
    }

    if (existing && existing.status === GoalStatus.ARCHIVED && data.status !== undefined && data.status !== GoalStatus.ARCHIVED) {
      throw new AppError({
        message: 'Cannot modify an archived goal',
        code: ERROR_CODES.GOAL_UPDATE_NOT_ALLOWED,
        statusCode: 409,
      });
    }
  }
}
