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
