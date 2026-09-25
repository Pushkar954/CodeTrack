import { Response, NextFunction } from 'express';
import { GoalService } from '../services/goalService.js';
import { AuthRequest } from '../middleware/clerkAuth.js';
import { successResponse, paginatedResponse } from '../utils/responseUtils.js';
import { IGoal, GoalStatus } from '@goalforge/shared';

export class GoalController {
  constructor(private goalService: GoalService) {}

  async createGoal(req: AuthRequest, res: Response, _next: NextFunction): Promise<void> {
    const userId = req.user!.clerkUserId;
    const goal = await this.goalService.createGoal(userId, req.body as Partial<IGoal>);
    successResponse(res, { goal }, 201);
  }

  async listGoals(req: AuthRequest, res: Response, _next: NextFunction): Promise<void> {
    const userId = req.user!.clerkUserId;
    const { page, limit, status, sortBy, sortOrder } = req.query as Record<string, string | undefined>;
    const result = await this.goalService.listGoals(userId, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      status,
      sortBy,
      sortOrder,
    });
    paginatedResponse(res, result.goals, {
      page: result.page,
      limit: result.goals.length > 0 ? Math.ceil(result.total / result.page) : 1,
      total: result.total,
      totalPages: result.totalPages,
    });
  }

  async getGoalById(req: AuthRequest, res: Response, _next: NextFunction): Promise<void> {
    const userId = req.user!.clerkUserId;
    const goal = await this.goalService.getGoalById(req.params.id, userId);
    successResponse(res, { goal });
  }

  async updateGoal(req: AuthRequest, res: Response, _next: NextFunction): Promise<void> {
    const userId = req.user!.clerkUserId;
    const goal = await this.goalService.updateGoal(req.params.id, userId, req.body as Partial<IGoal>);
    successResponse(res, { goal });
  }

  async archiveGoal(req: AuthRequest, res: Response, _next: NextFunction): Promise<void> {
    const userId = req.user!.clerkUserId;
    await this.goalService.archiveGoal(req.params.id, userId);
    res.status(200).json({ success: true, data: { message: 'Goal archived' } });
  }

  async changeStatus(req: AuthRequest, res: Response, _next: NextFunction): Promise<void> {
    const userId = req.user!.clerkUserId;
    const status = (req.body as { status: GoalStatus }).status;
    const goal = await this.goalService.changeStatus(req.params.id, userId, status);
    successResponse(res, { goal });
  }
}
