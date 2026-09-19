import { Router } from 'express';
import { setupTaskRoutes } from './taskRoutes.js';
import { setupDashboardRoutes } from './dashboardRoutes.js';

export function setupRoutes(): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      data: { status: 'ok', timestamp: new Date().toISOString() },
    });
  });

  router.use('/api/v1/tasks', setupTaskRoutes());
  router.use('/api/v1/dashboard', setupDashboardRoutes());

  return router;
}
