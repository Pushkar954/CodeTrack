import { Router } from 'express';
import { authenticateRequest } from '../middleware/clerkAuth.js';
import { DashboardController } from '../controllers/dashboardController.js';

const router = Router();
const dashboardController = new DashboardController();

router.use(authenticateRequest);

router.get('/stats', dashboardController.getStats.bind(dashboardController));

export function setupDashboardRoutes(): Router {
  return router;
}
