import { RequestHandler } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { config } from '../config/config.js';

const limiter = new RateLimiterMemory({
  points: config.NODE_ENV === 'test' ? 1000 : 100,
  duration: 60,
});

export const rateLimiterMiddleware: RequestHandler = async (req, _res, next) => {
  try {
    await limiter.consume(req.ip || 'unknown');
    next();
  } catch {
    const error = new Error('Too many requests') as any;
    error.statusCode = 429;
    error.code = 'RATE_LIMITED';
    next(error);
  }
};
