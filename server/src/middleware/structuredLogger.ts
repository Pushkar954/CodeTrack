import { RequestHandler } from 'express';
import { config } from '../config/config.js';

export const structuredLogger: RequestHandler = (req, res, next) => {
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
    };

    if (config.LOG_FORMAT === 'json') {
      console.log(JSON.stringify(logEntry));
    } else {
      console.log(`[${logEntry.timestamp}] ${logEntry.requestId} ${logEntry.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    }
  });

  next();
};
