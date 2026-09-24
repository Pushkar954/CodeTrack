import { Schema, model, Document, PaginateModel, PipelineStage } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface IPaginationResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export const MAX_PAGE_LIMIT = 100;
export const DEFAULT_PAGE_LIMIT = 20;

export function sanitizePaginationOptions(options: IPaginationOptions): {
  page: number;
  limit: number;
  sort: Record<string, number>;
} {
  const page = Math.max(1, Math.floor(Number(options.page) || 1));
  const limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, Math.floor(Number(options.limit) || DEFAULT_PAGE_LIMIT)));
  const sortOrder = options.order === 'asc' ? 1 : -1;
  const sort = options.sort ? { [options.sort]: sortOrder } : { createdAt: -1 };

  return { page, limit, sort };
}
