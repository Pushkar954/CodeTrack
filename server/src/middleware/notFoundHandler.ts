import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appError';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  const message = "Can't find " + req.originalUrl + " on this server";
  next(new AppError(message, 404, 'NOT_FOUND'));
}
