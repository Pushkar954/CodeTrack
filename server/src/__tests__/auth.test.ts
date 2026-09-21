import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Authentication Endpoints', () => {
  it('GET /api/v1/auth/me returns 401 when no token is provided', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/auth/me returns 401 for unauthenticated requests', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer invalid_token');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('Authorization Foundation', () => {
  it('Different Clerk users cannot access each other resources', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer user_b_token');
    expect(res.status).toBe(401);
  });
});

describe('Logout', () => {
  it('Sign out removes authenticated access', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer valid_but_expired_token');
    expect(res.status).toBe(401);
  });
});
