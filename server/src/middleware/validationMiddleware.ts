import { z } from 'zod';

export function createValidationMiddleware<T extends z.ZodTypeAny>(schema: T) {
  return (req: any, _res: any, next: any): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const details = result.error.issues.map((issue: any) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      const error = new Error('Validation failed') as any;
      error.details = details;
      error.statusCode = 400;
      error.code = 'VALIDATION_ERROR';
      next(error);
      return;
    }

    req.body = result.data.body;
    req.query = result.data.query;
    req.params = result.data.params;
    next();
  };
}
