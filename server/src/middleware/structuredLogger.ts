import { RequestHandler } from 'express';
import { AuthRequest } from '../types/auth.js';

export const structuredLogger: RequestHandler = (req: AuthRequest, res, next) => {
  const startTime = Date.now();
  const requestId = req.requestId || 'unknown';

  res.locals.method = req.method;
  res.locals.route = req.originalUrl;
  res.locals.requestId = requestId;

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
    };

    if (res.statusCode >= 500) {
      console.error(JSON.stringify({ ...logEntry, level: 'ERROR' }));
    } else if (res.statusCode >= 400) {
      console.warn(JSON.stringify({ ...logEntry, level: 'WARN' }));
    } else {
      console.log(JSON.stringify({ ...logEntry, level: 'INFO' }));
    }
  });

  next();
};
