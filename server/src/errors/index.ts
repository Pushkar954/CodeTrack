import { AppError, OperationalError, ProgrammerError, ValidationError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError, RateLimitError, DatabaseError, ExternalServiceError, TimeoutError, ClerkAuthError, ClerkForbiddenError, InternalServerError, UnknownError } from './appError.js';
import { normalizeError, createErrorResponse } from './errorNormalizer.js';
import { HTTP_STATUS_MAP, getStatusCode } from './httpStatusMap.js';

export {
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
  normalizeError,
  createErrorResponse,
  HTTP_STATUS_MAP,
  getStatusCode,
};
export type { NormalizedError } from './errorNormalizer.js';
