import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config.js';

export function healthLiveness(_req: Request, res: Response): void {
  res.status(200).json({
    success: true,
    data: { status: 'alive', timestamp: new Date().toISOString() },
  });
}

export async function healthReadiness(req: Request, res: Response): Promise<void> {
  try {
    const dbStatus = await (req as any).dbCheck?.();
    res.status(200).json({
      success: true,
      data: { status: 'ready', timestamp: new Date().toISOString(), database: dbStatus },
    });
  } catch {
    res.status(503).json({
      success: false,
      data: { status: 'not ready', timestamp: new Date().toISOString(), database: 'unavailable' },
    });
  }
}
