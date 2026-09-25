import { Request, Response, NextFunction } from 'express';

export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function asyncWrapper<T extends (...args: unknown[]) => Promise<void>>(fn: T): (...args: unknown[]) => void {
  return (...args: unknown[]): void => {
    Promise.resolve(fn(...args)).catch((err: unknown) => {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error(String(err));
    });
  };
}
