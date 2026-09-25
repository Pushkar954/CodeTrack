import { ERROR_CODES, HTTP_STATUS } from '@goalforge/shared';

export type ErrorCause = Error | undefined;
export type ErrorDetails = Record<string, unknown> | undefined;
export type Retryable = boolean | undefined;
export type ErrorLevel = 'INFO' | 'WARN' | 'ERROR';

export interface IAppErrorOptions {
  message: string;
  code: string;
  statusCode: number;
  cause?: ErrorCause;
  details?: ErrorDetails;
  retryable?: Retryable;
  requestId?: string;
  isOperational?: boolean;
}

export interface ErrorMetadata {
  requestId?: string;
  method?: string;
  route?: string;
  statusCode: number;
  errorCode: string;
  timestamp: string;
  userId?: string;
  clerkUserId?: string;
  duration?: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly isRetryable: boolean;
  public readonly cause: ErrorCause;
  public readonly details: ErrorDetails;
  public readonly requestId: string | undefined;

  constructor(options: IAppErrorOptions) {
    super(options.message);
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.isOperational = options.isOperational ?? true;
    this.isRetryable = options.retryable ?? false;
    this.cause = options.cause;
    this.details = options.details;
    this.requestId = options.requestId;

    Error.captureStackTrace(this, this.constructor);
  }

  get publicMessage(): string {
    return this.message;
  }

  get safeMetadata(): Record<string, unknown> {
    return {
      code: this.code,
      message: this.message,
      ...(this.requestId ? { requestId: this.requestId } : {}),
      ...(this.details ? { details: this.details } : {}),
    };
  }
}

export class OperationalError extends AppError {
  constructor(options: IAppErrorOptions) {
    super({ ...options, isOperational: true });
  }
}

export class ProgrammerError extends AppError {
  constructor(options: IAppErrorOptions) {
    super({ ...options, isOperational: false });
  }
}

export class ValidationError extends OperationalError {
  constructor(message = 'The request data is invalid', details?: ErrorDetails, options?: { requestId?: string }) {
    super({
      message,
      code: ERROR_CODES.VALIDATION_ERROR,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      details,
      retryable: false,
      requestId: options?.requestId,
    });
  }
}

export class BadRequestError extends OperationalError {
  constructor(message = 'The request could not be understood by the server', options?: { requestId?: string }) {
    super({
      message,
      code: ERROR_CODES.BAD_REQUEST,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      retryable: false,
      requestId: options?.requestId,
    });
  }
}

export class UnauthorizedError extends OperationalError {
  constructor(message = 'Authentication is required', options?: { requestId?: string }) {
    super({
      message,
      code: ERROR_CODES.UNAUTHORIZED_ERROR,
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      retryable: false,
      requestId: options?.requestId,
    });
  }
}

export class ForbiddenError extends OperationalError {
  constructor(message = 'You do not have permission to perform this action', options?: { requestId?: string }) {
    super({
      message,
      code: ERROR_CODES.FORBIDDEN_ERROR,
      statusCode: HTTP_STATUS.FORBIDDEN,
      retryable: false,
      requestId: options?.requestId,
    });
  }
}

export class NotFoundError extends OperationalError {
  constructor(message = 'The requested resource was not found', options?: { requestId?: string }) {
    super({
      message,
      code: ERROR_CODES.NOT_FOUND_ERROR,
      statusCode: HTTP_STATUS.NOT_FOUND,
      retryable: false,
      requestId: options?.requestId,
    });
  }
}

export class ConflictError extends OperationalError {
  constructor(message = 'A conflict occurred with the current state', options?: { requestId?: string }) {
    super({
      message,
      code: ERROR_CODES.CONFLICT_ERROR,
      statusCode: HTTP_STATUS.CONFLICT,
      retryable: false,
      requestId: options?.requestId,
    });
  }
}

export class RateLimitError extends OperationalError {
  constructor(message = 'Too many requests, please try again later', options?: { requestId?: string }) {
    super({
      message,
      code: ERROR_CODES.RATE_LIMITED_ERROR,
      statusCode: HTTP_STATUS.RATE_LIMITED,
      retryable: true,
      requestId: options?.requestId,
    });
  }
}

export class DatabaseError extends OperationalError {
  constructor(message = 'A database operation failed', options?: { requestId?: string; cause?: Error }) {
    super({
      message,
      code: ERROR_CODES.DATABASE_ERROR,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      retryable: true,
      cause: options?.cause,
      requestId: options?.requestId,
    });
  }
}

export class ExternalServiceError extends OperationalError {
  public readonly provider: string;
  public readonly operation: string;

  constructor(
    message = 'An external service encountered an error',
    options: { provider: string; operation: string; requestId?: string; cause?: Error; retryable?: boolean } = { provider: 'unknown', operation: 'unknown' }
  ) {
    super({
      message: message || 'An external service encountered an error',
      code: ERROR_CODES.EXTERNAL_SERVICE_ERROR,
      statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
      retryable: options.retryable ?? true,
      cause: options.cause,
      requestId: options.requestId,
    });
    this.provider = options.provider;
    this.operation = options.operation;
  }
}

export class TimeoutError extends OperationalError {
  constructor(message = 'The request timed out', options?: { requestId?: string }) {
    super({
      message,
      code: ERROR_CODES.TIMEOUT_ERROR,
      statusCode: HTTP_STATUS.REQUEST_TIMEOUT,
      retryable: true,
      requestId: options?.requestId,
    });
  }
}

export class ClerkAuthError extends OperationalError {
  constructor(message = 'Authentication failed', options?: { requestId?: string }) {
    super({
      message,
      code: ERROR_CODES.CLERK_AUTH_ERROR,
      statusCode: HTTP_STATUS.UNAUTHORIZED,
      retryable: false,
      requestId: options?.requestId,
    });
  }
}

export class ClerkForbiddenError extends OperationalError {
  constructor(message = 'Access denied', options?: { requestId?: string }) {
    super({
      message,
      code: ERROR_CODES.CLERK_FORBIDDEN_ERROR,
      statusCode: HTTP_STATUS.FORBIDDEN,
      retryable: false,
      requestId: options?.requestId,
    });
  }
}

export class InternalServerError extends ProgrammerError {
  constructor(message = 'An unexpected error occurred', options?: { requestId?: string; cause?: Error }) {
    super({
      message,
      code: ERROR_CODES.INTERNAL_ERROR,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      retryable: false,
      cause: options?.cause,
      requestId: options?.requestId,
    });
  }
}

export class UnknownError extends ProgrammerError {
  constructor(options?: { requestId?: string; cause?: Error }) {
    super({
      message: 'An unexpected error occurred',
      code: ERROR_CODES.UNKNOWN_ERROR,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      retryable: false,
      cause: options?.cause,
      requestId: options?.requestId,
    });
  }
}
