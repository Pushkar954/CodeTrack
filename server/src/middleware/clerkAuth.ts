import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import type { IUser } from '../models/User.js';
import { UnauthorizedError, ForbiddenError } from '../errors/appError.js';

export interface AuthRequest extends Request {
  user?: IUser;
  auth?: { userId?: string };
  resourceUserId?: string;
}

export function clerkAuth(_req: AuthRequest, _res: Response, next: NextFunction): void {
  next();
}

export async function authenticateRequest(req: AuthRequest, _res: Response, next: NextFunction): Promise<void> {
  try {
    const auth = req.auth;
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

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAuthenticated(req: AuthRequest, _res: Response, next: NextFunction): void {
  const user = req.user;
  if (!user) {
    next(new UnauthorizedError());
    return;
  }
  next();
}

export function requireOwnership(req: AuthRequest, _res: Response, next: NextFunction): void {
  const user = req.user;
  const resourceUserId = req.resourceUserId;

  if (!user) {
    next(new ForbiddenError());
    return;
  }

  if (user._id!.toString() !== resourceUserId) {
    next(new ForbiddenError('You do not have permission to perform this action'));
    return;
  }

  next();
}
