import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/appError.js';

export async function clerkAuthMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required');
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    const clerkUserId = token;

    if (!clerkUserId) {
      throw new UnauthorizedError('Invalid token');
    }

    (req as any).clerkUser = {
      clerkUserId,
      email: '',
      name: '',
      profileImage: '',
    };

    next();
  } catch (error) {
    next(new UnauthorizedError('Authentication required'));
  }
}
