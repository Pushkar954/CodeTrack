import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config.js';
import { normalizeError, createErrorResponse } from '../errors/errorNormalizer.js';
import { AppError } from '../errors/appError.js';

export function errorHandler(err: Error | AppError, _req: Request, res: Response, _next: NextFunction): void {
  const requestId = (err as AppError).requestId || (res.locals as Record<string, unknown>).requestId as string || 'unknown';
  const normalized = normalizeError(err, requestId);

  const method = (res.locals as Record<string, unknown>).method as string || _req.method;
  const route = (res.locals as Record<string, unknown>).route as string || _req.originalUrl;

  const logEntry = {
    timestamp: new Date().toISOString(),
    requestId,
    method,
    route,
    statusCode: normalized.statusCode,
    errorCode: normalized.error.code,
    message: err.message,
    stack: config.NODE_ENV !== 'production' ? err.stack : undefined,
    ...(normalized.error.cause ? { cause: normalized.error.cause.message } : {}),
  };

  if (normalized.error.isOperational === false) {
    console.error('[PROGRAMMER ERROR]', JSON.stringify(logEntry));
  } else if (normalized.statusCode >= 500) {
    console.error('[SERVER ERROR]', JSON.stringify(logEntry));
  } else {
    console.warn('[ERROR]', JSON.stringify(logEntry));
  }

  const responseBody: Record<string, unknown> = createErrorResponse(normalized.error, requestId);

  if (config.NODE_ENV === 'development') {
    responseBody.debug = {
      stack: err.stack,
      message: err.message,
    };
  }

  res.status(normalized.statusCode).json(responseBody);
}
