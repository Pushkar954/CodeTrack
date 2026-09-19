import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/config.js';
import { connectDB, closeDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { setupRoutes } from './routes/index.js';

const app = express();

export async function startServer(): Promise<void> {
  try {
    await connectDB();

    app.use(helmet());
    app.use(cors({ origin: config.CLIENT_URL, credentials: true }));

    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true }));

    if (config.NODE_ENV !== 'test') {
      app.use(morgan(config.NODE_ENV === 'development' ? 'dev' : 'combined'));
    }

    app.use(requestLogger);
    app.use('/api', rateLimiter);
    app.use('/api/v1', setupRoutes());

    app.get('/api/v1/health', (_req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        data: {
          status: 'ok',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        },
      });
    });

    app.use(notFoundHandler);
    app.use(errorHandler);

    const PORT = config.PORT;
    const server = app.listen(PORT, () => {
      console.log(`[Server] Running on port ${PORT} in ${config.NODE_ENV} mode`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n[Server] ${signal} received. Shutting down...`);
      server.close(async () => {
        await closeDB();
        console.log('[Server] Process terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('uncaughtException', (err) => {
      console.error('[Server] Uncaught Exception:', err.message);
      shutdown('uncaughtException');
    });
    process.on('unhandledRejection', (reason) => {
      console.error('[Server] Unhandled Rejection:', reason);
      shutdown('unhandledRejection');
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
}

export default app;
