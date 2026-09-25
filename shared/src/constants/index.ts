export const APP_NAME = 'GoalForge AI';
export const APP_VERSION = '1.0.0';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  RATE_LIMITED: 429,
  REQUEST_TIMEOUT: 408,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED_ERROR: 'UNAUTHORIZED_ERROR',
  FORBIDDEN_ERROR: 'FORBIDDEN_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  RATE_LIMITED_ERROR: 'RATE_LIMITED_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  CLERK_AUTH_ERROR: 'CLERK_AUTH_ERROR',
  CLERK_FORBIDDEN_ERROR: 'CLERK_FORBIDDEN_ERROR',
} as const;

export const ERROR_DETAILS = {
  VALIDATION_ERROR: 'The request data is invalid',
  BAD_REQUEST: 'The request could not be understood by the server',
  UNAUTHORIZED_ERROR: 'Authentication is required',
  FORBIDDEN_ERROR: 'You do not have permission to perform this action',
  NOT_FOUND_ERROR: 'The requested resource was not found',
  CONFLICT_ERROR: 'A conflict occurred with the current state',
  RATE_LIMITED_ERROR: 'Too many requests, please try again later',
  INTERNAL_ERROR: 'An unexpected error occurred',
  DATABASE_ERROR: 'A database operation failed',
  EXTERNAL_SERVICE_ERROR: 'An external service encountered an error',
  TIMEOUT_ERROR: 'The request timed out',
  UNKNOWN_ERROR: 'An unexpected error occurred',
  CLERK_AUTH_ERROR: 'Authentication failed',
  CLERK_FORBIDDEN_ERROR: 'Access denied',
} as const;
