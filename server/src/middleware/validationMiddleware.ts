import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export function createValidationMiddleware<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      const error = new Error('Validation failed');
      (error as any).details = details;
      (error as any).statusCode = 400;
      (error as any).code = 'VALIDATION_ERROR';
      next(error);
      return;
    }

    req.body = result.data.body;
    req.query = result.data.query as Record<string, string>;
    req.params = result.data.params as Record<string, string>;
    next();
  };
}
