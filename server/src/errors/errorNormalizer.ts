import { z } from 'zod';
import { AppError, ValidationError, BadRequestError, ConflictError, RateLimitError, ExternalServiceError, UnknownError, ClerkAuthError, ClerkForbiddenError } from './appError.js';
import { ErrorDetail } from '@goalforge/shared';

export interface NormalizedError {
  error: AppError;
  statusCode: number;
  requestId?: string;
}

export function createErrorResponse(error: AppError, requestId?: string): Record<string, unknown> {
  const response: Record<string, unknown> = {
    success: false,
    error: {
      code: error.code,
      message: error.publicMessage,
      ...(requestId ? { requestId } : {}),
    },
  };

  if (error.details) {
    if (Array.isArray(error.details)) {
      (response.error as Record<string, unknown>).details = error.details;
    } else if (typeof error.details === 'object') {
      (response.error as Record<string, unknown>).details = [error.details as unknown as ErrorDetail];
    }
  }

  return response;
}

export function normalizeZodError(error: z.ZodError, requestId?: string): AppError {
  const details = error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message } as ErrorDetail));
  return new ValidationError('The request data is invalid', details as unknown as Record<string, unknown>, { requestId });
}

export function normalizeMongooseValidationError(error: { errors?: Record<string, { message: string; path?: string }> }, requestId?: string): AppError {
  const details = Object.values(error.errors || {}).map((e) => ({ field: e.path || '', message: e.message } as ErrorDetail));
  return new ValidationError('Validation failed', details as unknown as Record<string, unknown>, { requestId });
}

export function normalizeMongooseDuplicateKey(error: { keyValue?: Record<string, unknown> }, requestId?: string): AppError {
  const field = Object.keys(error.keyValue || {})[0] || 'field';
  return new ConflictError(`Duplicate key violation: ${field}`, { requestId });
}

export function normalizeMongooseCastError(error: { kind?: string }, requestId?: string): AppError {
  return new BadRequestError(`Invalid ${error.kind || 'identifier'}`, { requestId });
}

export function normalizeRateLimitError(_error: unknown, requestId?: string): AppError {
  return new RateLimitError(undefined, { requestId });
}

export function normalizeClerkError(error: { name?: string }, requestId?: string): AppError {
  const name = error.name?.toUpperCase() || '';
  if (name.includes('FORBIDDEN') || name.includes('PERMISSION')) {
    return new ClerkForbiddenError(undefined, { requestId });
  }
  return new ClerkAuthError(undefined, { requestId });
}

export function normalizeExternalServiceError(error: { provider: string; operation: string; statusCode?: number; cause?: Error }, requestId?: string): AppError {
  return new ExternalServiceError(undefined, {
    provider: error.provider,
    operation: error.operation,
    requestId,
    cause: error.cause,
    retryable: error.statusCode ? error.statusCode >= 500 : true,
  });
}

export function normalizeUnknownError(error: unknown, requestId?: string): AppError {
  if (error instanceof Error) {
    return new UnknownError({ requestId, cause: error });
  }
  return new UnknownError({ requestId, cause: new Error(String(error)) });
}

export function normalizeError(error: unknown, requestId?: string): NormalizedError {
  if (error instanceof AppError) {
    return { error, statusCode: error.statusCode, requestId };
  }

  if (error instanceof z.ZodError) {
    const appError = normalizeZodError(error, requestId);
    return { error: appError, statusCode: appError.statusCode, requestId };
  }

  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>;

    if (err.name === 'MongoServerError' && err.code === 11000) {
      const appError = normalizeMongooseDuplicateKey(err as { keyValue?: Record<string, unknown> }, requestId);
      return { error: appError, statusCode: appError.statusCode, requestId };
    }

    if (err.kind === 'ObjectId' || err.name === 'CastError') {
      const appError = normalizeMongooseCastError(err as { kind?: string }, requestId);
      return { error: appError, statusCode: appError.statusCode, requestId };
    }

    if (err.errors && typeof err.errors === 'object') {
      const appError = normalizeMongooseValidationError(err as { errors: Record<string, { message: string; path?: string }> }, requestId);
      return { error: appError, statusCode: appError.statusCode, requestId };
    }

    if (typeof error === 'object' && error !== null) {
      const e = error as Record<string, unknown>;
      if (e.statusCode === 429 || e.code === 'RATE_LIMITED') {
        const appError = normalizeRateLimitError(e, requestId);
        return { error: appError, statusCode: appError.statusCode, requestId };
      }
    }
  }

  const appError = normalizeUnknownError(error, requestId);
  return { error: appError, statusCode: appError.statusCode, requestId };
}

export function getHttpStatus(error: AppError): number {
  return error.statusCode;
}

export function isRetryable(error: AppError): boolean {
  return error.isRetryable;
}

export function isOperational(error: AppError): boolean {
  return error.isOperational;
}
