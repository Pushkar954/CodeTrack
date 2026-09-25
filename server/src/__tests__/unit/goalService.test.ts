import { describe, it, expect } from 'vitest';
import { GoalService } from '../../services/goalService.js';
import { GoalRepository } from '../../repositories/goalRepository.js';
import { AuthService } from '../../services/authService.js';
import { GoalStatus } from '@goalforge/shared';
import { AppError } from '../../errors/appError.js';
import { NotFoundError, BadRequestError } from '../../errors/appError.js';

class MockGoalRepository {
  private goals: Map<string, Record<string, unknown>> = new Map();
  private _idCounter = 1;

  create(data: Partial<Record<string, unknown>>): Promise<Record<string, unknown>> {
    return Promise.resolve(this._create(data));
  }

  private _create(data: Partial<Record<string, unknown>>): Record<string, unknown> {
    const id = String(this._idCounter++);
    const goal = { _id: id, ...data, createdAt: new Date(), updatedAt: new Date() };
    this.goals.set(id, goal);
    return goal;
  }

  findById(id: string): Promise<Record<string, unknown> | null> {
    return Promise.resolve((this.goals.get(id) as Record<string, unknown>) || null);
  }

  findByUser(userId: string, _options?: Record<string, unknown>): Promise<{ goals: Record<string, unknown>[]; total: number; page: number; totalPages: number }> {
    const userGoals = Array.from(this.goals.values()).filter(g => g.userId === userId);
    return Promise.resolve({ goals: userGoals, total: userGoals.length, page: 1, totalPages: 1 });
  }

  findByIdAndUser(id: string, userId: string): Promise<Record<string, unknown> | null> {
    const goal = this.goals.get(id) as Record<string, unknown>;
    const result = (goal && goal.userId === userId) ? goal : null;
    return Promise.resolve(result);
  }

  update(id: string, data: Partial<Record<string, unknown>>): Promise<Record<string, unknown> | null> {
    const existing = this.goals.get(id) as Record<string, unknown>;
    const result = existing ? { ...existing, ...data, updatedAt: new Date() } : null;
    if (result) this.goals.set(id, result as Record<string, unknown>);
    return Promise.resolve(result);
  }

  archive(id: string, userId: string): Promise<boolean> {
    const goal = this.goals.get(id) as Record<string, unknown>;
    const result = (!goal || goal.userId !== userId) ? false : true;
    if (result) this.goals.set(id, { ...goal, status: GoalStatus.ARCHIVED, archivedAt: new Date() });
    return Promise.resolve(result);
  }

  countByUser(userId: string, _status?: string): Promise<number> {
    return Promise.resolve(Array.from(this.goals.values()).filter(g => g.userId === userId).length);
  }
}

class MockAuthService {
  private static users: Map<string, Record<string, unknown>> = new Map();

  static initialize(): void {
    MockAuthService.users.set('clerk_1', { _id: 'user_1', clerkUserId: 'clerk_1' });
    MockAuthService.users.set('clerk_2', { _id: 'user_2', clerkUserId: 'clerk_2' });
  }

  static findByClerkUserId(clerkUserId: string): Promise<Record<string, unknown> | null> {
    const user = MockAuthService.users.get(clerkUserId);
    return Promise.resolve(user || null);
  }
}

MockAuthService.initialize();

function createService(): { service: GoalService; repo: MockGoalRepository } {
  const repo = new MockGoalRepository();
  const service = new GoalService(repo as unknown as GoalRepository, MockAuthService as unknown as typeof AuthService);
  return { service, repo };
}

describe('GoalService', () => {
  describe('createGoal', () => {
    it('Should create a goal with DRAFT status by default', async () => {
      const { service } = createService();
      const result = await service.createGoal('clerk_1', {
        title: 'Test Goal',
        category: 'DSA',
        currentLevel: 'BEGINNER',
        targetLevel: 'INTERMEDIATE',
        durationDays: 30,
        dailyStudyMinutes: 60,
        preferredLanguage: 'PYTHON',
        preferredPlatform: 'LEETCODE',
      });
      expect(result.title).toBe('Test Goal');
      expect(result.status).toBe(GoalStatus.DRAFT);
    });

    it('Should throw NotFoundError when user does not exist', async () => {
      const { service } = createService();
      await expect(service.createGoal('nonexistent', {
        title: 'Test Goal',
        category: 'DSA',
        currentLevel: 'BEGINNER',
        targetLevel: 'INTERMEDIATE',
        durationDays: 30,
        dailyStudyMinutes: 60,
        preferredLanguage: 'PYTHON',
        preferredPlatform: 'LEETCODE',
      })).rejects.toThrow(NotFoundError);
    });

    it('Should throw BadRequestError when endDate is before startDate', async () => {
      const { service } = createService();
      await expect(service.createGoal('clerk_1', {
        title: 'Test Goal',
        category: 'DSA',
        currentLevel: 'BEGINNER',
        targetLevel: 'INTERMEDIATE',
        durationDays: 30,
        dailyStudyMinutes: 60,
        preferredLanguage: 'PYTHON',
        preferredPlatform: 'LEETCODE',
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-01-10'),
      })).rejects.toThrow(BadRequestError);
    });

    it('Should throw BadRequestError when dailyStudyMinutes exceeds max', async () => {
      const { service } = createService();
      await expect(service.createGoal('clerk_1', {
        title: 'Test Goal',
        category: 'DSA',
        currentLevel: 'BEGINNER',
        targetLevel: 'INTERMEDIATE',
        durationDays: 30,
        dailyStudyMinutes: 500,
        preferredLanguage: 'PYTHON',
        preferredPlatform: 'LEETCODE',
      })).rejects.toThrow(BadRequestError);
    });

    it('Should throw BadRequestError when targetLevel is not higher than currentLevel', async () => {
      const { service } = createService();
      await expect(service.createGoal('clerk_1', {
        title: 'Test Goal',
        category: 'DSA',
        currentLevel: 'INTERMEDIATE',
        targetLevel: 'BEGINNER',
        durationDays: 30,
        dailyStudyMinutes: 60,
        preferredLanguage: 'PYTHON',
        preferredPlatform: 'LEETCODE',
      })).rejects.toThrow(BadRequestError);
    });
  });

  describe('listGoals', () => {
    it('Should return goals for the user', async () => {
      const { service } = createService();
      await service.createGoal('clerk_1', {
        title: 'Test Goal',
        category: 'DSA',
        currentLevel: 'BEGINNER',
        targetLevel: 'INTERMEDIATE',
        durationDays: 30,
        dailyStudyMinutes: 60,
        preferredLanguage: 'PYTHON',
        preferredPlatform: 'LEETCODE',
      });
      const result = await service.listGoals('clerk_1');
      expect(result.goals.length).toBe(1);
      expect(result.total).toBe(1);
    });

    it('Should throw NotFoundError when user does not exist', async () => {
      const { service } = createService();
      await expect(service.listGoals('nonexistent')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getGoalById', () => {
    it('Should return goal when it belongs to the user', async () => {
      const { service } = createService();
      await service.createGoal('clerk_1', {
        title: 'Test Goal',
        category: 'DSA',
        currentLevel: 'BEGINNER',
        targetLevel: 'INTERMEDIATE',
        durationDays: 30,
        dailyStudyMinutes: 60,
        preferredLanguage: 'PYTHON',
        preferredPlatform: 'LEETCODE',
      });
      const result = await service.getGoalById('1', 'clerk_1');
      expect(result.title).toBe('Test Goal');
    });

    it('Should throw NotFoundError when goal belongs to different user', async () => {
      const { service } = createService();
      await service.createGoal('clerk_1', {
        title: 'Test Goal',
        category: 'DSA',
        currentLevel: 'BEGINNER',
        targetLevel: 'INTERMEDIATE',
        durationDays: 30,
        dailyStudyMinutes: 60,
        preferredLanguage: 'PYTHON',
        preferredPlatform: 'LEETCODE',
      });
      await expect(service.getGoalById('1', 'clerk_2')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateGoal', () => {
    it('Should update goal fields', async () => {
      const { service } = createService();
      await service.createGoal('clerk_1', {
        title: 'Test Goal',
        category: 'DSA',
        currentLevel: 'BEGINNER',
        targetLevel: 'INTERMEDIATE',
        durationDays: 30,
        dailyStudyMinutes: 60,
        preferredLanguage: 'PYTHON',
        preferredPlatform: 'LEETCODE',
      });
      const result = await service.updateGoal('1', 'clerk_1', { title: 'Updated Goal' });
      expect(result.title).toBe('Updated Goal');
    });

    it('Should throw NotFoundError when goal does not belong to user', async () => {
      const { service } = createService();
      await service.createGoal('clerk_1', {
        title: 'Test Goal',
        category: 'DSA',
        currentLevel: 'BEGINNER',
        targetLevel: 'INTERMEDIATE',
        durationDays: 30,
        dailyStudyMinutes: 60,
        preferredLanguage: 'PYTHON',
        preferredPlatform: 'LEETCODE',
      });
      await expect(service.updateGoal('1', 'clerk_2', { title: 'Updated' })).rejects.toThrow(NotFoundError);
    });
  });

  describe('archiveGoal', () => {
    it('Should archive a goal', async () => {
      const { service } = createService();
      await service.createGoal('clerk_1', {
        title: 'Test Goal',
        category: 'DSA',
        currentLevel: 'BEGINNER',
        targetLevel: 'INTERMEDIATE',
        durationDays: 30,
        dailyStudyMinutes: 60,
        preferredLanguage: 'PYTHON',
        preferredPlatform: 'LEETCODE',
      });
      const result = await service.archiveGoal('1', 'clerk_1');
      expect(result).toBe(true);
    });

    it('Should throw ConflictError when goal is already archived', async () => {
      const { service } = createService();
      await service.createGoal('clerk_1', {
        title: 'Test Goal',
        category: 'DSA',
        currentLevel: 'BEGINNER',
        targetLevel: 'INTERMEDIATE',
        durationDays: 30,
        dailyStudyMinutes: 60,
        preferredLanguage: 'PYTHON',
        preferredPlatform: 'LEETCODE',
        status: GoalStatus.ARCHIVED,
      });
      await expect(service.archiveGoal('1', 'clerk_1')).rejects.toThrow(AppError);
    });
  });

  describe('changeStatus', () => {
    it('Should change status from DRAFT to ACTIVE', async () => {
      const { service } = createService();
      await service.createGoal('clerk_1', {
        title: 'Test Goal',
        category: 'DSA',
        currentLevel: 'BEGINNER',
        targetLevel: 'INTERMEDIATE',
        durationDays: 30,
        dailyStudyMinutes: 60,
        preferredLanguage: 'PYTHON',
        preferredPlatform: 'LEETCODE',
      });
      const result = await service.changeStatus('1', 'clerk_1', GoalStatus.ACTIVE);
      expect(result.status).toBe(GoalStatus.ACTIVE);
    });

    it('Should throw error for invalid status transition', async () => {
      const { service } = createService();
      await service.createGoal('clerk_1', {
        title: 'Test Goal',
        category: 'DSA',
        currentLevel: 'BEGINNER',
        targetLevel: 'INTERMEDIATE',
        durationDays: 30,
        dailyStudyMinutes: 60,
        preferredLanguage: 'PYTHON',
        preferredPlatform: 'LEETCODE',
      });
      await expect(service.changeStatus('1', 'clerk_1', GoalStatus.COMPLETED as GoalStatus)).rejects.toThrow(AppError);
    });
  });
});
