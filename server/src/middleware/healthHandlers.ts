import { RequestHandler } from 'express';

export const healthLiveness: RequestHandler = (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'alive', timestamp: new Date().toISOString() },
  });
};

export const healthReadiness: RequestHandler = (_req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'ready', timestamp: new Date().toISOString() },
  });
};
