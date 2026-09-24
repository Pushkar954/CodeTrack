import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export const filterSchema = z.object({
  search: z.string().optional(),
  filters: z.record(z.unknown()).optional(),
});

export type FilterParams = z.infer<typeof filterSchema>;
