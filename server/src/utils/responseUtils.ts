import { Response } from 'express';

export function successResponse<T>(res: Response, data: T, status = 200): void {
  res.status(status).json({ success: true, data });
}

export function paginatedResponse<T>(res: Response, data: T[], pagination: {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}, status = 200): void {
  res.status(status).json({
    success: true,
    data,
    meta: {
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.totalPages,
      },
    },
  });
}

export function errorResponse(res: Response, code: string, message: string, details?: Record<string, unknown>[], status = 400): void {
  res.status(status).json({
    success: false,
    error: { code, message, details },
  });
}

export function notFoundResponse(res: Response, resource = 'Resource'): void {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `${resource} not found` },
  });
}
