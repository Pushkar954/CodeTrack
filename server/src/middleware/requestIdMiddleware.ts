import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const requestIdMiddleware: RequestHandler = (req, _res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  (req as any).requestId = requestId;
  (req as any).requestStartTime = Date.now();
  next();
};
