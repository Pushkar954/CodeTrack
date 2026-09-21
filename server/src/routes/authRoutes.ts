import { Router } from 'express';
import { UnauthorizedError } from '../errors/appError.js';
import type { IUser } from '../models/User.js';

const router = Router();

router.get('/me', async (req, res) => {
  try {
    const user = (req as any).user as IUser;

    if (!user) {
      throw new UnauthorizedError('Authentication required');
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          clerkUserId: user.clerkUserId,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    throw error;
  }
});

export function setupAuthRoutes(): Router {
  return router;
}
