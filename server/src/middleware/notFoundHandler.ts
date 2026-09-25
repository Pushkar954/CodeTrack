import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/appError.js';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  const error = new NotFoundError(`Can't find ${req.originalUrl} on this server`);
  next(error);
}
