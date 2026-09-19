import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appError.js';
import { config } from '../config/config.js';

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  console.error(`[ERROR] ${err.message}`, err.stack);

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: config.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message,
    },
  });
}
