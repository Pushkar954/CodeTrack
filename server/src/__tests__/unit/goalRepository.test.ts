import { describe, it, expect, beforeEach } from 'vitest';
import { GoalRepository } from '../../repositories/goalRepository.js';
import { IGoal, GoalStatus } from '@goalforge/shared';
import { Goal } from '../../models/Goal.js';

class MockQueryBuilder {
  private filter: Record<string, unknown>;
  private sortObj: Record<string, number> = {};
  private skipVal = 0;
  private limitVal = 20;
  private model: MockGoalModel;
  private isCount = false;
  private isSingle = false;

  constructor(model: MockGoalModel, filter: Record<string, unknown>, isCount = false, isSingle = false) {
    this.model = model;
    this.filter = filter;
    this.isCount = isCount;
    this.isSingle = isSingle;
  }

  sort(_obj: Record<string, number>): MockQueryBuilder {
    this.sortObj = _obj;
    return this;
  }

  skip(_val: number): MockQueryBuilder {
    this.skipVal = _val;
    return this;
  }

  limit(_val: number): MockQueryBuilder {
    this.limitVal = _val;
    return this;
  }

  lean(): Promise<Record<string, unknown> | Record<string, unknown>[] | number | null> {
    if (this.isCount) {
      return Promise.resolve(Array.from(this.model.goals.values()).filter(g => {
        return Object.entries(this.filter).every(([k, v]) => g[k] === v);
      }).length);
    }
    let results = Array.from(this.model.goals.values()).filter(g => {
      return Object.entries(this.filter).every(([k, v]) => g[k] === v);
    });
    if (Object.keys(this.sortObj).length > 0) {
      const sortField = Object.keys(this.sortObj)[0];
      const sortOrder = this.sortObj[sortField];
      results.sort((a, b) => {
        const aVal = String(a[sortField] || '');
        const bVal = String(b[sortField] || '');
        return sortOrder === 1 ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });
    }
    results = results.slice(this.skipVal, this.skipVal + this.limitVal);
    if (this.isSingle && results.length === 0) {
      return Promise.resolve(null);
    }
    return Promise.resolve(results);
  }
}

class MockGoalModel {
  goals: Map<string, Record<string, unknown>> = new Map();
  private _idCounter = 1;

  create(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const id = String(this._idCounter++);
    const goal = { _id: id, ...data, createdAt: new Date(), updatedAt: new Date() };
    this.goals.set(id, goal);
    return Promise.resolve(goal);
  }

  findById(id: string): MockQueryBuilder {
    return new MockQueryBuilder(this, { _id: id }, false, true);
  }

  find(filter: Record<string, unknown>): MockQueryBuilder {
    return new MockQueryBuilder(this, filter);
  }

  findOne(filter: Record<string, unknown>): MockQueryBuilder {
    return new MockQueryBuilder(this, filter, false, true);
  }

  findByIdAndUpdate(id: string, data: Record<string, unknown>, _options: Record<string, unknown>): MockQueryBuilder {
    const existing = this.goals.get(id);
    if (!existing) return new MockQueryBuilder(this, { _id: id }, false, true);
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.goals.set(id, updated);
    return new MockQueryBuilder(this, { _id: id }, false, true);
  }

  countDocuments(filter: Record<string, unknown>): MockQueryBuilder {
    return new MockQueryBuilder(this, filter, true);
  }
}

describe('GoalRepository', () => {
  let repo: GoalRepository;
  let model: MockGoalModel;

  beforeEach(() => {
    model = new MockGoalModel();
    repo = new GoalRepository(model as unknown as typeof Goal);
  });

  describe('create', () => {
    it('Should create a goal and return it', async () => {
      const data: Record<string, unknown> = {
        userId: 'user_1',
        title: 'Test Goal',
        category: 'DSA',
        currentLevel: 'BEGINNER',
        targetLevel: 'INTERMEDIATE',
        durationDays: 30,
        dailyStudyMinutes: 60,
        preferredLanguage: 'PYTHON',
        preferredPlatform: 'LEETCODE',
        status: GoalStatus.DRAFT,
      };
      const result = await repo.create(data);
      expect(result.title).toBe('Test Goal');
      expect(result.userId).toBe('user_1');
    });
  });

  describe('findById', () => {
    it('Should return null for non-existent goal', async () => {
      const result = await repo.findById('999');
      expect(result).toBeNull();
    });
  });

  describe('findByUser', () => {
    it('Should return goals for a user', async () => {
      await repo.create({ userId: 'user_1', title: 'Goal 1' } as Partial<IGoal>);
      await repo.create({ userId: 'user_2', title: 'Goal 2' } as Partial<IGoal>);
      const result = await repo.findByUser('user_1');
      expect(result.total).toBe(1);
      expect(result.goals[0].title).toBe('Goal 1');
    });
  });

  describe('findByIdAndUser', () => {
    it('Should return null when goal does not belong to user', async () => {
      await repo.create({ userId: 'user_1', title: 'Goal 1' } as Partial<IGoal>);
      const result = await repo.findByIdAndUser('1', 'user_2');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('Should return null for non-existent goal', async () => {
      const result = await repo.update('999', { title: 'Updated' });
      expect(result).toBeNull();
    });
  });

  describe('archive', () => {
    it('Should return false for non-existent goal', async () => {
      const result = await repo.archive('999', 'user_1');
      expect(result).toBe(false);
    });
  });

  describe('countByUser', () => {
    it('Should return count of goals for user', async () => {
      await repo.create({ userId: 'user_1', title: 'Goal 1' } as Partial<IGoal>);
      await repo.create({ userId: 'user_1', title: 'Goal 2' } as Partial<IGoal>);
      const count = await repo.countByUser('user_1');
      expect(count).toBe(2);
    });
  });
});
