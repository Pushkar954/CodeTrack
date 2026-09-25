import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthRequest } from '../types/auth.js';

export const requestIdMiddleware: RequestHandler = (req: AuthRequest, res, next) => {
  const requestId = Array.isArray(req.headers['x-request-id']) ? req.headers['x-request-id'][0] : (req.headers['x-request-id'] || uuidv4());
  req.requestId = requestId;
  req.requestStartTime = Date.now();
  res.locals.requestId = requestId;
  res.locals.requestStartTime = Date.now();
  next();
};
