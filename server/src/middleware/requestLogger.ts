import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  const startTime = Date.now();
  req.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(
      `[${req.method}] ${req.originalUrl} ${req.statusCode} - ${duration}ms`
    );
  });
  next();
}
