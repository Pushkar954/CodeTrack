import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/config.js';
import { connectDB, closeDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { requestIdMiddleware } from './middleware/requestIdMiddleware.js';
import { structuredLogger } from './middleware/structuredLogger.js';
import { clerkAuth } from './middleware/clerkAuth.js';
import { corsMiddleware } from './middleware/corsMiddleware.js';
import { rateLimiterMiddleware } from './middleware/rateLimiterMiddleware.js';
import { healthLiveness, healthReadiness } from './middleware/healthHandlers.js';
import { setupRoutes } from './routes/index.js';

const app = express();

export async function startServer(): Promise<void> {
  try {
    await connectDB();

    app.use(helmet());
    app.use(corsMiddleware);
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true }));

    if (config.NODE_ENV !== 'test') {
      app.use(morgan(config.NODE_ENV === 'development' ? 'dev' : 'combined'));
    }

    app.use(requestIdMiddleware);
    app.use(structuredLogger);
    app.use(clerkAuth);
    app.use(rateLimiterMiddleware);

    app.get('/api/v1/health/live', healthLiveness);
    app.get('/api/v1/health/ready', healthReadiness);
    app.get('/api/v1/health', (_req: Request, res: Response) => {
      const requestId = (res.locals as Record<string, unknown>).requestId as string || 'unknown';
      res.set('X-Request-ID', requestId);
      res.status(200).json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
    });

    app.use('/api/v1', setupRoutes());

    app.use(notFoundHandler);
    app.use(errorHandler);

    const PORT = config.PORT;
    const server = app.listen(PORT, () => {
      console.log(`[Server] Running on port ${PORT} in ${config.NODE_ENV} mode`);
    });

    const shutdown = async (signal: string): Promise<void> => {
      console.log(`\n[Server] ${signal} received. Shutting down...`);
      await new Promise<void>((resolve) => {
        server.close(() => {
          void closeDB();
          console.log('[Server] Process terminated.');
          resolve();
        });
      });
      process.exit(0);
    };

    process.on('SIGTERM', () => { void shutdown('SIGTERM'); });
    process.on('SIGINT', () => { void shutdown('SIGINT'); });
    process.on('uncaughtException', (err) => {
      console.error('[Server] Uncaught Exception:', err.message, err.stack);
      void shutdown('uncaughtException');
    });
    process.on('unhandledRejection', (reason) => {
      console.error('[Server] Unhandled Rejection:', reason);
      void shutdown('unhandledRejection');
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

export default app;
