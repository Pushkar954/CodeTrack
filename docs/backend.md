# GoalForge AI - Backend Documentation

## Overview

The GoalForge AI backend is a production-grade Express.js server built with TypeScript, following a modular monolith architecture.

## Core Layers

### 1. Middleware Layer
Middleware processes every incoming request before it reaches routes. The pipeline is:

1. **Request ID** (`requestIdMiddleware`) — Assigns unique correlation ID
2. **Structured Logging** (`structuredLogger`) — Logs request/response metadata
3. **Clerk Auth** (`clerkAuth`) — Verifies JWT via `@clerk/express`
4. **Rate Limiting** (`rateLimiterMiddleware`) — Throttles excessive requests
5. **CORS** (`corsMiddleware`) — Restricts origins to configured frontend
6. **Validation** (`validationMiddleware`) — Validates body/query/params via Zod
7. **Authentication** (`authenticateRequest`) — Maps Clerk identity to MongoDB user
8. **Authorization** (`requireAuthenticated`) — Ensures user is authenticated

### 2. Route Layer
Routes are organized under `/api/v1/`:
- `/api/v1/auth` — Authentication endpoints
- `/api/v1/tasks` — Task management
- `/api/v1/dashboard` — Dashboard statistics

Future modules add new route files following the same pattern.

### 3. Controller Layer
Controllers are thin HTTP handlers that:
- Extract validated data
- Call the appropriate service
- Return responses or pass errors to the handler

Controllers must NOT contain business logic or database queries.

### 4. Service Layer
Services coordinate business operations:
- `AuthService` — User synchronization and lookup
- Future services: `GoalService`, `RoadmapService`, `TaskService`, etc.

Services call repositories, not models directly.

### 5. Repository Layer
Repositories abstract database access:
- `IRepository<T>` — Generic interface for CRUD operations
- `createBaseRepository(model)` — Factory function for model-specific repositories

### 6. Model Layer
Mongoose models:
- `User` — Application user linked to Clerk
- `Task` — DSA task tracking

### 7. Utility Layer
- `responseUtils.ts` — Standardized API response formatting
- `pagination.ts` — Pagination with server-enforced limits
- `errorMapper.ts` — Database error → Application error mapping
- `authorization.ts` — Ownership verification utilities

## API Versioning

All APIs are versioned under `/api/v1/`. Versioning allows backward-compatible changes in future releases.

## Environment Configuration

Configuration is centralized in `server/src/config/config.ts` using Zod validation. All environment variables are validated at startup.

## Testing

Tests are organized in `server/src/__tests__/`:
- `unit/` — Unit tests for utilities, error handling, authorization
- `integration/` — Integration tests for auth, middleware, infrastructure

Run tests: `npm run test` (from server directory)

## Scalability

The backend is designed to be stateless, supporting horizontal scaling:
- No in-memory application state
- MongoDB is the persistent state layer
- Clerk handles authentication state
- Rate limiting can be replaced with Redis-backed implementation
- CORS is origin-restricted for production security
