export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ErrorDetail {
  field: string;
  message: string;
}

export interface ErrorMetadata {
  requestId?: string;
  method?: string;
  route?: string;
  statusCode: number;
  errorCode: string;
  timestamp: string;
  userId?: string;
  clerkUserId?: string;
  duration?: string;
}

export interface IGoal {
  userId: string;
  title: string;
  description: string;
  category: string;
  currentLevel: string;
  targetLevel: string;
  durationDays: number;
  dailyStudyMinutes: number;
  preferredLanguage: string;
  preferredPlatform: string;
  status: GoalStatus;
  progress: number;
  startDate?: Date;
  endDate?: Date;
  archivedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGoalDocument {
  userId: string;
  title: string;
  description: string;
  category: string;
  currentLevel: string;
  targetLevel: string;
  durationDays: number;
  dailyStudyMinutes: number;
  preferredLanguage: string;
  preferredPlatform: string;
  status: GoalStatus;
  progress: number;
  startDate?: Date;
  endDate?: Date;
  archivedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum GoalStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export const GOAL_STATUS_TRANSITIONS: Record<GoalStatus, GoalStatus[]> = {
  [GoalStatus.DRAFT]: [GoalStatus.ACTIVE],
  [GoalStatus.ACTIVE]: [GoalStatus.PAUSED, GoalStatus.COMPLETED, GoalStatus.ARCHIVED],
  [GoalStatus.PAUSED]: [GoalStatus.ACTIVE, GoalStatus.ARCHIVED],
  [GoalStatus.COMPLETED]: [GoalStatus.ARCHIVED],
  [GoalStatus.ARCHIVED]: [],
};

export const VALID_GOAL_CATEGORIES = ['DSA', 'SYSTEM DESIGN', 'CODING INTERVIEWS', 'LANGUAGE LEARNING', 'OTHER'] as const;
export const VALID_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'INTERVIEW_READY'] as const;
export const VALID_LANGUAGES = ['JAVA', 'PYTHON', 'JAVASCRIPT', 'TYPESCRIPT', 'C++', 'OTHER'] as const;
export const VALID_PLATFORMS = ['LEETCODE', 'HACKERRANK', 'CODEFORCES', 'CODEARCHITECT', 'OTHER'] as const;
export const MAX_DAILY_STUDY_MINUTES = 480;
export const MIN_DAILY_STUDY_MINUTES = 5;
export const MAX_GOAL_TITLE_LENGTH = 200;
export const MAX_GOAL_DESCRIPTION_LENGTH = 2000;
