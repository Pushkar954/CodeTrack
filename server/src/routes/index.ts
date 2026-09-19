import { Router } from 'express';

export function setupRoutes(): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.status(200).json({
      success: true,
      data: { status: 'ok', timestamp: new Date().toISOString() },
    });
  });

  return router;
}
