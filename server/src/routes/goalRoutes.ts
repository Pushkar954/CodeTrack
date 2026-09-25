import { Router, RequestHandler } from 'express';
import { authenticateRequest, requireAuthenticated } from '../middleware/clerkAuth.js';
import { GoalController } from '../controllers/goalController.js';
import { GoalService } from '../services/goalService.js';
import { GoalRepository } from '../repositories/goalRepository.js';
import { AuthService } from '../services/authService.js';
import { Goal } from '../models/Goal.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const goalRepository = new GoalRepository(Goal);
const goalService = new GoalService(goalRepository, AuthService);
const goalController = new GoalController(goalService);

const listGoalsHandler = asyncHandler(goalController.listGoals.bind(goalController)) as RequestHandler;
const createGoalHandler = asyncHandler(goalController.createGoal.bind(goalController)) as RequestHandler;
const getGoalByIdHandler = asyncHandler(goalController.getGoalById.bind(goalController)) as RequestHandler;
const updateGoalHandler = asyncHandler(goalController.updateGoal.bind(goalController)) as RequestHandler;
const archiveGoalHandler = asyncHandler(goalController.archiveGoal.bind(goalController)) as RequestHandler;
const changeStatusHandler = asyncHandler(goalController.changeStatus.bind(goalController)) as RequestHandler;

router.use(authenticateRequest as RequestHandler);
router.use(requireAuthenticated as RequestHandler);

router.route('/')
  .get(listGoalsHandler)
  .post(createGoalHandler);

router.route('/:id')
  .get(getGoalByIdHandler)
  .patch(updateGoalHandler)
  .delete(archiveGoalHandler);

router.post('/:id/status', changeStatusHandler);

export function setupGoalRoutes(): Router {
  return router;
}
