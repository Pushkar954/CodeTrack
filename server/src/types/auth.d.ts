import { Request } from 'express';

export interface AuthRequest extends Request {
  body: Record<string, unknown>;
  query: Record<string, unknown>;
  params: Record<string, unknown>;
  user?: import('../models/User.js').IUser;
  auth?: { userId?: string };
  resourceUserId?: string;
  requestId?: string;
  requestStartTime?: number;
}
