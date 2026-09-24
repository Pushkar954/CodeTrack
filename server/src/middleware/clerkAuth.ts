import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import type { IUser } from '../models/User.js';

export function clerkAuth(_req: Request, _res: Response, next: NextFunction): void {
  next();
}

export async function authenticateRequest(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const auth = (req as any).auth;
    const clerkUserId = auth?.userId;

    if (!clerkUserId) {
      next();
      return;
    }

    const user = await AuthService.findByClerkUserId(clerkUserId);

    if (!user) {
      next();
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAuthenticated(req: Request, _res: Response, next: NextFunction): void {
  const user = (req as any).user as IUser | undefined;
  if (!user) {
    next(new Error('Authentication required'));
    (next as any).statusCode = 401;
    return;
  }
  next();
}
