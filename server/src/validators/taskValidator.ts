import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional().default(''),
  topic: z.string().min(1),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).default('Medium'),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  status: z.enum(['Pending', 'In Progress', 'Completed']).default('Pending'),
  deadline: z.string().datetime().optional(),
  problemUrl: z.string().url().optional().default(''),
  notes: z.string().max(500).optional().default(''),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  topic: z.string().min(1).optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
  deadline: z.string().datetime().optional(),
  problemUrl: z.string().url().optional(),
  notes: z.string().max(500).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['Pending', 'In Progress', 'Completed']),
});

export const taskFiltersSchema = z.object({
  topic: z.string().optional(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['newest', 'oldest', 'deadline', 'priority', 'difficulty']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
