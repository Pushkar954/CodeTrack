import { Router, Request, Response } from 'express';
import { requireAuthenticated } from '../middleware/clerkAuth.js';
import type { IUser } from '../models/User.js';

const router = Router();

router.get('/me', requireAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as IUser;

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
