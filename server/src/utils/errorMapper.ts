import { DatabaseError, ExternalServiceError, TimeoutError } from '../errors/appError.js';
import { MongooseError } from 'mongoose';

export function mapDatabaseError(error: unknown): DatabaseError {
  if (error instanceof MongooseError) {
    const mongooseError = error as { code?: number; errors?: Record<string, { message: string }> };

    if (mongooseError.code === 11000) {
      return new DatabaseError('A database operation failed', { cause: error });
    }
    if (mongooseError.errors) {
      return new DatabaseError('Validation failed', { cause: error });
    }
    return new DatabaseError('Database operation failed', { cause: error });
  }

  return new DatabaseError('Internal server error', { cause: error instanceof Error ? error : undefined });
}

export function mapMongooseCastError(error: { kind?: string; value?: unknown }): DatabaseError {
  return new DatabaseError(`Invalid ${error.kind || 'identifier'}`, { cause: undefined });
}

export function mapExternalServiceError(provider: string, operation: string, cause: Error, retryable = true): ExternalServiceError {
  return new ExternalServiceError('An external service encountered an error', { provider, operation, cause, retryable });
}

export function mapTimeoutError(message = 'The request timed out'): TimeoutError {
  return new TimeoutError(message);
}
