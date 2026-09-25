import { z } from 'zod';
import { GoalStatus } from '@goalforge/shared';

const statusEnum = Object.values(GoalStatus) as [string, ...string[]];

export const createGoalSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().default(''),
  category: z.enum(['DSA', 'SYSTEM DESIGN', 'CODING INTERVIEWS', 'LANGUAGE LEARNING', 'OTHER']),
  currentLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'INTERVIEW_READY']),
  targetLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'INTERVIEW_READY']),
  durationDays: z.number().int().min(1).max(365),
  dailyStudyMinutes: z.number().int().min(5).max(480),
  preferredLanguage: z.enum(['JAVA', 'PYTHON', 'JAVASCRIPT', 'TYPESCRIPT', 'C++', 'OTHER']),
  preferredPlatform: z.enum(['LEETCODE', 'HACKERRANK', 'CODEFORCES', 'CODEARCHITECT', 'OTHER']),
  status: z.enum(statusEnum).optional().default(GoalStatus.DRAFT),
  progress: z.number().int().min(0).max(100).optional().default(0),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const updateGoalSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  category: z.enum(['DSA', 'SYSTEM DESIGN', 'CODING INTERVIEWS', 'LANGUAGE LEARNING', 'OTHER']).optional(),
  currentLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'INTERVIEW_READY']).optional(),
  targetLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'INTERVIEW_READY']).optional(),
  durationDays: z.number().int().min(1).max(365).optional(),
  dailyStudyMinutes: z.number().int().min(5).max(480).optional(),
  preferredLanguage: z.enum(['JAVA', 'PYTHON', 'JAVASCRIPT', 'TYPESCRIPT', 'C++', 'OTHER']).optional(),
  preferredPlatform: z.enum(['LEETCODE', 'HACKERRANK', 'CODEFORCES', 'CODEARCHITECT', 'OTHER']).optional(),
  status: z.enum(statusEnum).optional(),
  progress: z.number().int().min(0).max(100).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const goalIdParamsSchema = z.object({
  id: z.string().min(24).max(24),
});

export const goalQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(statusEnum).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'startDate', 'endDate', 'title', 'status', 'category']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type GoalIdParams = z.infer<typeof goalIdParamsSchema>;
export type GoalQuery = z.infer<typeof goalQuerySchema>;
