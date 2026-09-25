import { Router } from 'express';
import { setupTaskRoutes } from './taskRoutes.js';
import { setupDashboardRoutes } from './dashboardRoutes.js';
import { setupAuthRoutes } from './authRoutes.js';
import { setupGoalRoutes } from './goalRoutes.js';

export function setupRoutes(): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      data: { status: 'ok', timestamp: new Date().toISOString() },
    });
  });

  router.use('/api/v1/auth', setupAuthRoutes());
  router.use('/api/v1/tasks', setupTaskRoutes());
  router.use('/api/v1/dashboard', setupDashboardRoutes());
  router.use('/api/v1/goals', setupGoalRoutes());

  return router;
}
