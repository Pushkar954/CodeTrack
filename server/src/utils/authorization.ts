import type { IUser } from '../models/User.js';

export interface AuthContext {
  clerkUserId: string;
  userId: string;
  sessionId?: string;
}

export function getAuthContext(req: { user?: IUser; auth?: { userId?: string } }): AuthContext | null {
  const user = req.user;
  const clerkUserId = req.auth?.userId;

  if (!user || !clerkUserId) {
    return null;
  }

  return {
    clerkUserId: user.clerkUserId,
    userId: user._id!.toString(),
    sessionId: clerkUserId,
  };
}

export function requireOwnership(resourceUserId: string, authContext: AuthContext): boolean {
  return resourceUserId === authContext.userId;
}
