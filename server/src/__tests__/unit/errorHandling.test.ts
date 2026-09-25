import { describe, it, expect } from 'vitest';
import {
  AppError,
  OperationalError,
  ProgrammerError,
  ValidationError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  ExternalServiceError,
  TimeoutError,
  ClerkAuthError,
  ClerkForbiddenError,
  InternalServerError,
  UnknownError,
} from '../../errors/appError.js';
import { createErrorResponse } from '../../errors/errorNormalizer.js';
import { ERROR_CODES, HTTP_STATUS } from '@goalforge/shared';

describe('AppError', () => {
  it('Creates an error with correct status code', () => {
    const error = new AppError({ message: 'Test', code: ERROR_CODES.INTERNAL_ERROR, statusCode: 500 });
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe(ERROR_CODES.INTERNAL_ERROR);
    expect(error.message).toBe('Test');
  });

  it('Defaults isOperational to true', () => {
    const error = new AppError({ message: 'Test', code: ERROR_CODES.INTERNAL_ERROR, statusCode: 500 });
    expect(error.isOperational).toBe(true);
  });

  it('Supports cause', () => {
    const cause = new Error('Root cause');
    const error = new AppError({ message: 'Test', code: ERROR_CODES.INTERNAL_ERROR, statusCode: 500, cause });
    expect(error.cause).toBe(cause);
  });

  it('Supports requestId', () => {
    const error = new AppError({ message: 'Test', code: ERROR_CODES.INTERNAL_ERROR, statusCode: 500, requestId: 'req-123' });
    expect(error.requestId).toBe('req-123');
  });

  it('Supports details', () => {
    const error = new AppError({ message: 'Test', code: ERROR_CODES.INTERNAL_ERROR, statusCode: 500, details: { field: 'email' } });
    expect(error.details).toBeDefined();
  });

  it('isOperational can be set to false', () => {
    const error = new AppError({ message: 'Test', code: ERROR_CODES.INTERNAL_ERROR, statusCode: 500, isOperational: false });
    expect(error.isOperational).toBe(false);
  });

  it('isRetryable defaults to false', () => {
    const error = new AppError({ message: 'Test', code: ERROR_CODES.INTERNAL_ERROR, statusCode: 500 });
    expect(error.isRetryable).toBe(false);
  });

  it('isRetryable can be set to true', () => {
    const error = new AppError({ message: 'Test', code: ERROR_CODES.DATABASE_ERROR, statusCode: 500, retryable: true });
    expect(error.isRetryable).toBe(true);
  });

  it('Returns publicMessage', () => {
    const error = new AppError({ message: 'Test message', code: ERROR_CODES.INTERNAL_ERROR, statusCode: 500 });
    expect(error.publicMessage).toBe('Test message');
  });

  it('Returns safeMetadata', () => {
    const error = new AppError({ message: 'Test', code: ERROR_CODES.INTERNAL_ERROR, statusCode: 500, requestId: 'req-123' });
    expect(error.safeMetadata.code).toBe(ERROR_CODES.INTERNAL_ERROR);
    expect(error.safeMetadata.requestId).toBe('req-123');
  });
});

describe('OperationalError', () => {
  it('Sets isOperational to true', () => {
    const error = new OperationalError({ message: 'Test', code: ERROR_CODES.BAD_REQUEST, statusCode: 400 });
    expect(error.isOperational).toBe(true);
  });
});

describe('ProgrammerError', () => {
  it('Sets isOperational to false', () => {
    const error = new ProgrammerError({ message: 'Test', code: ERROR_CODES.INTERNAL_ERROR, statusCode: 500 });
    expect(error.isOperational).toBe(false);
  });
});

describe('ValidationError', () => {
  it('Defaults to 400 status', () => {
    const error = new ValidationError();
    expect(error.statusCode).toBe(HTTP_STATUS.BAD_REQUEST);
    expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  it('Supports details', () => {
    const error = new ValidationError('Invalid', [{ field: 'email', message: 'Invalid email' }] as unknown as Record<string, unknown>);
    expect(error.details).toBeDefined();
    expect(error.message).toBe('Invalid');
  });

  it('isRetryable is false', () => {
    const error = new ValidationError();
    expect(error.isRetryable).toBe(false);
  });
});

describe('BadRequestError', () => {
  it('Defaults to 400', () => {
    const error = new BadRequestError();
    expect(error.statusCode).toBe(400);
  });
});

describe('UnauthorizedError', () => {
  it('Defaults to 401', () => {
    const error = new UnauthorizedError();
    expect(error.statusCode).toBe(401);
  });
});

describe('ForbiddenError', () => {
  it('Defaults to 403', () => {
    const error = new ForbiddenError();
    expect(error.statusCode).toBe(403);
  });
});

describe('NotFoundError', () => {
  it('Defaults to 404', () => {
    const error = new NotFoundError();
    expect(error.statusCode).toBe(404);
  });
});

describe('ConflictError', () => {
  it('Defaults to 409', () => {
    const error = new ConflictError();
    expect(error.statusCode).toBe(409);
  });
});

describe('RateLimitError', () => {
  it('Defaults to 429 and retryable', () => {
    const error = new RateLimitError();
    expect(error.statusCode).toBe(429);
    expect(error.isRetryable).toBe(true);
  });
});

describe('DatabaseError', () => {
  it('Defaults to 500 and retryable', () => {
    const error = new DatabaseError();
    expect(error.statusCode).toBe(500);
    expect(error.isRetryable).toBe(true);
  });
});

describe('ExternalServiceError', () => {
  it('Defaults to 503 and retryable', () => {
    const error = new ExternalServiceError('Service failed', { provider: 'openai', operation: 'generate' });
    expect(error.statusCode).toBe(503);
    expect(error.isRetryable).toBe(true);
    expect(error.provider).toBe('openai');
    expect(error.operation).toBe('generate');
  });
});

describe('TimeoutError', () => {
  it('Defaults to 408 and retryable', () => {
    const error = new TimeoutError();
    expect(error.statusCode).toBe(408);
    expect(error.isRetryable).toBe(true);
  });
});

describe('ClerkAuthError', () => {
  it('Defaults to 401', () => {
    const error = new ClerkAuthError();
    expect(error.statusCode).toBe(401);
  });
});

describe('ClerkForbiddenError', () => {
  it('Defaults to 403', () => {
    const error = new ClerkForbiddenError();
    expect(error.statusCode).toBe(403);
  });
});

describe('InternalServerError', () => {
  it('Defaults to 500 and isOperational false', () => {
    const error = new InternalServerError();
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(false);
  });
});

describe('UnknownError', () => {
  it('Defaults to 500 and isOperational false', () => {
    const error = new UnknownError();
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(false);
  });
});

describe('Error Response Format', () => {
  it('Creates standard error response', () => {
    const error = new AppError({ message: 'Test', code: ERROR_CODES.INTERNAL_ERROR, statusCode: 500 });
    const response = createErrorResponse(error);
    expect(response.success).toBe(false);
    expect((response as Record<string, unknown>).error).toBeDefined();
  });

  it('Includes requestId when provided', () => {
    const error = new AppError({ message: 'Test', code: ERROR_CODES.INTERNAL_ERROR, statusCode: 500, requestId: 'req-123' });
    const response = createErrorResponse(error, 'req-123');
    expect((response as Record<string, unknown>).error).toBeDefined();
  });

  it('Includes details when present', () => {
    const error = new ValidationError('Invalid', [{ field: 'email', message: 'Invalid email' }] as unknown as Record<string, unknown>);
    const response = createErrorResponse(error);
    expect((response as Record<string, unknown>).error).toBeDefined();
  });
});
