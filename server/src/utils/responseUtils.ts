import { Request, Response } from 'express';
import { config } from '../config/config.js';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>[];
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export function successResponse<T>(res: Response, data: T, status = 200): void {
  res.status(status).json({ success: true, data } as ApiResponse<T>);
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
  } as ApiResponse<T[]>);
}

export function errorResponse(res: Response, code: string, message: string, details?: Record<string, unknown>[], status = 400): void {
  res.status(status).json({
    success: false,
    error: { code, message, details },
  } as ApiResponse<never>);
}

export function notFoundResponse(res: Response, resource = 'Resource'): void {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `${resource} not found` },
  } as ApiResponse<never>);
}
