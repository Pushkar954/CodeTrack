import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export function requestIdMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const requestId = req.headers['x-request-id'] || uuidv4();
  (req as any).requestId = requestId;
  (req as any).requestStartTime = Date.now();
  next();
}
