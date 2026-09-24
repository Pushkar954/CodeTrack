import { AppError } from '../errors/appError.js';
import { ERROR_CODES } from '@goalforge/shared';
import { MongooseError, ValidationError as MongooseValidationError, CastError } from 'mongoose';

export function mapDatabaseError(error: unknown): AppError {
  if (error instanceof MongooseValidationError) {
    const details = Object.entries(error.errors).reduce<Record<string, string>>((acc, [key, val]) => {
      acc[key] = val.message;
      return acc;
    }, {});
    return new AppError(
      'Validation failed',
      400,
      ERROR_CODES.VALIDATION_ERROR
    );
  }

  if (error instanceof CastError) {
    return new AppError(
      'Invalid resource identifier',
      400,
      ERROR_CODES.BAD_REQUEST
    );
  }

  if (error instanceof MongooseError) {
    if ((error as any).code === 11000) {
      return new AppError(
        'Resource already exists',
        409,
        ERROR_CODES.CONFLICT_ERROR
      );
    }
    return new AppError(
      'Database operation failed',
      500,
      ERROR_CODES.DATABASE_ERROR
    );
  }

  return new AppError(
    'Internal server error',
    500,
    ERROR_CODES.INTERNAL_ERROR
  );
}
