# GoalForge AI - Testing Documentation

## Overview

GoalForge AI uses **Vitest** for both client and server testing. Tests are organized by category:

```
server/src/__tests__/
├── unit/           # Unit tests for utilities, services, error handling
└── integration/    # Integration tests for auth, middleware, endpoints
```

## Running Tests

```bash
# Run all server tests
npm run test  # (from server directory)

# Run tests with coverage
npx vitest run --coverage

# Run tests in watch mode
npx vitest
```

## Test Categories

### Unit Tests (`__tests__/unit/`)

Test individual utilities and functions without external dependencies:
- Error handling (`errorHandling.test.ts`)
- Authorization utilities (`authorization.test.ts`)
- Infrastructure components (`infrastructure.test.ts`)

### Integration Tests (`__tests__/integration/`)

Test the full request lifecycle with mocked external services:
- Authentication (`auth.test.ts`)
- Infrastructure middleware (`infrastructure.test.ts`)

## Mocking Strategy

External services (Clerk, MongoDB) are mocked in tests:
- `@clerk/express` is mocked to simulate `clerkMiddleware()` and `getAuth()`
- Mongoose models are mocked to simulate database operations
- No test depends on a real production Clerk account or database

## Test Environment Isolation

The test environment is clearly separated from development and production:
- `NODE_ENV=test` configures the application for testing
- Separate MongoDB URI (`MONGO_URI_TEST`) for integration tests
- Test configuration uses higher rate limits to avoid false positives

## Writing Tests

### Unit Test Pattern

```typescript
describe('FunctionName', () => {
  it('Does X when Y', () => {
    expect(result).toBe(expected);
  });
});
```

### Integration Test Pattern

```typescript
describe('Endpoint', () => {
  it('Returns 401 for unauthenticated requests', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
```

## Test Coverage Targets

- All new infrastructure must have tests
- Error mapping must cover all error types
- Middleware must test both authenticated and unauthenticated flows
- Validation must test edge cases

## Client Tests

Client tests are located in `client/src/__tests__/` and use Vitest with jsdom.

Run client tests: `npm run test` (from client directory)
