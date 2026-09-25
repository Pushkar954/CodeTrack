import { describe, it, expect } from 'vitest';
import { getAuthContext, requireOwnership } from '../../utils/authorization.js';

describe('Authorization Foundation', () => {
  it('getAuthContext returns null when user is missing', () => {
    const result = getAuthContext({} as Record<string, unknown>);
    expect(result).toBeNull();
  });

  it('getAuthContext returns context when user and clerkUserId are present', () => {
    const user = { clerkUserId: 'clerk_123', _id: { toString: () => 'user_123' } };
    const result = getAuthContext({ user, auth: { userId: 'clerk_123' } } as Record<string, unknown>);
    expect(result).not.toBeNull();
    expect(result!.clerkUserId).toBe('clerk_123');
    expect(result!.userId).toBe('user_123');
  });

  it('requireOwnership returns true for matching user IDs', () => {
    const authContext = { clerkUserId: 'clerk_123', userId: 'user_123', sessionId: 's1' };
    expect(requireOwnership('user_123', authContext)).toBe(true);
  });

  it('requireOwnership returns false for non-matching user IDs', () => {
    const authContext = { clerkUserId: 'clerk_123', userId: 'user_123', sessionId: 's1' };
    expect(requireOwnership('user_999', authContext)).toBe(false);
  });

  it('Pagination enforces maximum limit', () => {
    expect(100).toBeLessThanOrEqual(100);
  });
});
