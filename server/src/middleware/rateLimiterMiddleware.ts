import { RequestHandler } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { config } from '../config/config.js';
import { RateLimitError } from '../errors/appError.js';

const limiter = new RateLimiterMemory({
  points: config.NODE_ENV === 'test' ? 1000 : 100,
  duration: 60,
});

export const rateLimiterMiddleware: RequestHandler = (req, _res, next): void => {
  limiter.consume(req.ip || 'unknown').then(
    () => next(),
    () => next(new RateLimitError())
  );
};
