import { z } from 'zod';
import { Response, NextFunction } from 'express';
import { ValidationError } from '../errors/appError.js';
import { ErrorDetail } from '@goalforge/shared';
import { AuthRequest } from '../types/auth.js';

export function createValidationMiddleware<T extends z.ZodTypeAny>(schema: T) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const details: ErrorDetail[] = result.error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message } as unknown as ErrorDetail));
      const error = new ValidationError('The request data is invalid', details as unknown as Record<string, unknown>);
      next(error);
      return;
    }

    const data = result.data as { body: unknown; query: unknown; params: unknown };
    req.body = data.body as Record<string, unknown>;
    req.query = data.query as Record<string, unknown>;
    req.params = data.params as Record<string, unknown>;
    next();
  };
}
