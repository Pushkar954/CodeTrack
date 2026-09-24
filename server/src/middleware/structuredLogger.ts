import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config.js';

export function structuredLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const requestId = (req as any).requestId || 'unknown';

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logEntry = {
      timestamp: new Date().toISOString(),
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    if (config.LOG_FORMAT === 'json') {
      console.log(JSON.stringify(logEntry));
    } else {
      console.log(
        `[${logEntry.timestamp}] ${logEntry.requestId} ${logEntry.method} ${logEntry.url} ${logEntry.statusCode} ${logEntry.duration}`
      );
    }
  });

  next();
}
