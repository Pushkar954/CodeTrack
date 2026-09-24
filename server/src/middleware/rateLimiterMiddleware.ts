import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config.js';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const limiter = new RateLimiterMemory({
  points: config.NODE_ENV === 'test' ? 1000 : 100,
  duration: 60,
});

export async function rateLimiterMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    await limiter.consume(req.ip || 'unknown');
    next();
  } catch {
    const error = new Error('Too many requests');
    (error as any).statusCode = 429;
    (error as any).code = 'RATE_LIMITED';
    next(error);
  }
}
