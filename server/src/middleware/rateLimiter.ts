import { Request, Response, NextFunction } from 'express';

export function rateLimiter(_req: Request, _res: Response, next: NextFunction): void {
  // Rate limiting will be implemented in a future phase
  next();
}
