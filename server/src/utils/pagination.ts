export function sanitizePaginationOptions(options: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}): { page: number; limit: number; sort: Record<string, number> } {
  const page = Math.max(1, Math.floor(Number(options.page) || 1));
  const limit = Math.min(100, Math.max(1, Math.floor(Number(options.limit) || 20)));
  const sortOrder = options.order === 'asc' ? 1 : -1;
  const sort = options.sort ? { [options.sort]: sortOrder } : { createdAt: -1 };
  return { page, limit, sort };
}

export const MAX_PAGE_LIMIT = 100;
export const DEFAULT_PAGE_LIMIT = 20;
