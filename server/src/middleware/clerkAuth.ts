import { Request, Response, NextFunction } from 'express';
import { clerkMiddleware, getAuth } from '@clerk/express';
import { AuthService } from '../services/authService.js';
import { UnauthorizedError } from '../errors/appError.js';
import type { IUser } from '../models/User.js';

export const clerkAuth = clerkMiddleware();

export async function authenticateRequest(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const auth = getAuth(req);
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
    (req as any).auth = auth;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAuthenticated(req: Request, _res: Response, next: NextFunction): void {
  const user = (req as any).user as IUser | undefined;

  if (!user) {
    next(new UnauthorizedError('Authentication required'));
    return;
  }

  next();
}
