# Error Handling Architecture

## Overview

GoalForge AI uses a centralized error-handling architecture that ensures all API errors are predictable, secure, consistent, and observable. Errors flow through a normalization layer before reaching the centralized error handler.

## Error Flow

```
Request → Middleware → Controller → Service → Repository/External
    ↓
Error
    ↓
Error Normalization
    ↓
Centralized Error Handler
    ↓
Structured Logging
    ↓
Safe API Response
```

## Error Class Hierarchy

### Base: `AppError`

All errors extend `AppError` which provides:

- `statusCode: number` — HTTP status code
- `code: string` — Stable error code
- `message: string` — Human-readable message
- `details?: Record<string, unknown>` — Optional error details
- `isOperational: boolean` — Whether the error is operational (expected) or programmer (unexpected)
- `isRetryable: boolean` — Whether the error is safe to retry
- `cause?: Error` — Original error cause
- `requestId?: string` — Request correlation ID
- `safeMetadata` — Safe serialization for logging

### Subclasses

| Class | Status | Code | Retryable | Operational |
|-------|--------|------|-----------|-------------|
| `ValidationError` | 400 | `VALIDATION_ERROR` | No | Yes |
| `BadRequestError` | 400 | `BAD_REQUEST` | No | Yes |
| `UnauthorizedError` | 401 | `UNAUTHORIZED_ERROR` | No | Yes |
| `ForbiddenError` | 403 | `FORBIDDEN_ERROR` | No | Yes |
| `NotFoundError` | 404 | `NOT_FOUND_ERROR` | No | Yes |
| `ConflictError` | 409 | `CONFLICT_ERROR` | No | Yes |
| `RateLimitError` | 429 | `RATE_LIMITED_ERROR` | Yes | Yes |
| `DatabaseError` | 500 | `DATABASE_ERROR` | Yes | Yes |
| `ExternalServiceError` | 503 | `EXTERNAL_SERVICE_ERROR` | Yes | Yes |
| `TimeoutError` | 408 | `TIMEOUT_ERROR` | Yes | Yes |
| `ClerkAuthError` | 401 | `CLERK_AUTH_ERROR` | No | Yes |
| `ClerkForbiddenError` | 403 | `CLERK_FORBIDDEN_ERROR` | No | Yes |
| `InternalServerError` | 500 | `INTERNAL_ERROR` | No | **No** |
| `UnknownError` | 500 | `UNKNOWN_ERROR` | No | **No** |

- `OperationalError` — Expected failures (all business errors)
- `ProgrammerError` — Unexpected failures (bugs, configuration issues)

## Error Codes

All error codes are defined in `@goalforge/shared`:

```typescript
const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED_ERROR: 'UNAUTHORIZED_ERROR',
  FORBIDDEN_ERROR: 'FORBIDDEN_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  RATE_LIMITED_ERROR: 'RATE_LIMITED_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  CLERK_AUTH_ERROR: 'CLERK_AUTH_ERROR',
  CLERK_FORBIDDEN_ERROR: 'CLERK_FORBIDDEN_ERROR',
} as const;
```

## HTTP Status Mapping

| Error Code | HTTP Status | Category |
|------------|-------------|----------|
| `VALIDATION_ERROR` | 400 | Client Error |
| `BAD_REQUEST` | 400 | Client Error |
| `UNAUTHORIZED_ERROR` | 401 | Client Error |
| `FORBIDDEN_ERROR` | 403 | Client Error |
| `NOT_FOUND_ERROR` | 404 | Client Error |
| `CONFLICT_ERROR` | 409 | Client Error |
| `RATE_LIMITED_ERROR` | 429 | Client Error |
| `TIMEOUT_ERROR` | 408 | Client Error |
| `DATABASE_ERROR` | 500 | Server Error |
| `EXTERNAL_SERVICE_ERROR` | 503 | Server Error |
| `INTERNAL_ERROR` | 500 | Server Error |
| `UNKNOWN_ERROR` | 500 | Server Error |
| `CLERK_AUTH_ERROR` | 401 | Client Error |
| `CLERK_FORBIDDEN_ERROR` | 403 | Client Error |

## Standard API Error Response

Every API error follows this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request data is invalid",
    "requestId": "abc123"
  }
}
```

For validation errors, details are included:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request data is invalid",
    "requestId": "abc123",
    "details": [
      { "field": "email", "message": "Invalid email address" }
    ]
  }
}
```

### Response Body Rules

- **Always**: `success: false`, `error.code`, `error.message`
- **Sometimes**: `error.requestId` (when available)
- **Sometimes**: `error.details` (validation errors only)
- **Never**: `stack`, `filePath`, `dbConnectionString`, `tokens`, `secrets`

## Error Normalization

The `normalizeError()` function converts various error types into `AppError`:

### Zod Validation Errors

Zod errors are converted to `ValidationError` with field-level details.

### MongoDB/Mongoose Errors

- **Duplicate key (11000)** → `ConflictError` (409)
- **Validation error** → `ValidationError` (400)
- **Cast error (Invalid ObjectId)** → `BadRequestError` (400)
- **Connection/timeout** → `DatabaseError` (500)

### Clerk Errors

- **Auth failure** → `ClerkAuthError` (401)
- **Permission denied** → `ClerkForbiddenError` (403)

### Rate Limiting

Rate limiter errors are converted to `RateLimitError` (429).

### External Service Errors

External service failures are converted to `ExternalServiceError` (503) with provider and operation metadata.

### Unknown Errors

Any unrecognized error is wrapped in `UnknownError` (500).

## Request IDs

Every request receives a unique `requestId` (UUID) via the `requestIdMiddleware`. This ID is:

1. Set as `X-Request-ID` response header
2. Included in error responses
3. Included in structured logs
4. Used for correlating logs with errors

## Structured Error Logging

All errors are logged in structured JSON format with:

- `timestamp` — ISO 8601
- `requestId` — Correlation ID
- `method` — HTTP method
- `route` — Request route
- `statusCode` — HTTP status
- `errorCode` — Application error code
- `message` — Error message
- `stack` — Stack trace (development only)
- `cause` — Original error message
- `level` — INFO/WARN/ERROR

### Log Levels

- **INFO**: Successful requests (2xx)
- **WARN**: Client errors (4xx)
- **ERROR**: Server errors (5xx) and programmer errors

## Development vs Production

### Development

- Error responses may include `debug.stack` and `debug.message`
- Full stack traces in logs
- Detailed error information for debugging

### Production

- No stack traces in responses
- Generic error messages (`"An unexpected error occurred"`)
- Controlled diagnostic information in logs
- `requestId` in responses for support debugging

## Security: Error Leakage Prevention

The following are **never** exposed to clients:

- Stack traces
- File paths
- MongoDB connection strings/URIs
- Clerk secret keys
- AI API keys
- Authorization headers/tokens
- Environment variables
- Database internals
- Internal service details

## Programmer Errors vs Operational Errors

### Operational Errors

Expected failures that users may encounter:
- Invalid input (400)
- Unauthorized access (401)
- Forbidden operations (403)
- Missing resources (404)
- Conflicts (409)
- Rate limiting (429)
- External timeouts (408)

These produce controlled responses and are logged as WARN.

### Programmer Errors

Unexpected failures indicating bugs:
- Null references
- Invariant violations
- Broken configuration
- Unexpected code paths

These are logged as ERROR with full diagnostic information and return generic production responses.

## Retryability

Errors that are safe to retry:
- `RateLimitError` (429)
- `DatabaseError` (500) — transient failures
- `ExternalServiceError` (503) — service outages
- `TimeoutError` (408) — network timeouts

Errors that should NOT be retried:
- All 4xx client errors
- `ClerkAuthError`, `ClerkForbiddenError`
- `InternalServerError`, `UnknownError`

## Developer Guidelines

### How to Throw Errors

```typescript
// Validation error
throw new ValidationError('Email is invalid', [{ field: 'email', message: 'Invalid format' }]);

// Not found
throw new NotFoundError('Goal not found');

// Conflict
throw new ConflictError('Goal already exists');

// Unauthorized
throw new UnauthorizedError('Please sign in');

// Database error with context
throw new DatabaseError('Failed to save goal', { cause: err });

// External service error
throw new ExternalServiceError('AI service unavailable', { provider: 'openai', operation: 'generate' });
```

### How to Handle Errors

1. **Do not** catch errors just to rethrow the same error
2. **Do** catch errors to add meaningful context
3. **Do** throw typed `AppError` subclasses from services
4. **Do** let the centralized error handler serialize errors
5. **Never** create custom error responses inside controllers
6. **Never** send raw errors to clients
7. **Never** expose sensitive internal information

### Async Error Handling

Use `asyncHandler` wrapper to ensure rejected promises reach the centralized error handler:

```typescript
import { asyncHandler } from '../utils/asyncHandler.js';

router.get('/tasks', asyncHandler(async (req, res) => {
  const tasks = await taskService.getTasks(req.user!.clerkUserId);
  successResponse(res, tasks);
}));
```

## Process-Level Error Handling

- `uncaughtException` and `unhandledRejection` trigger graceful shutdown
- The server closes connections, closes the database, and exits
- The process manager/container orchestrator restarts the process
- Fatal errors are logged before shutdown

## Future Observability

The error architecture is designed to integrate with future observability tools:

- `normalizeError()` provides a clean interface for reporting
- `requestId` enables trace correlation
- `isOperational` and `isRetryable` inform alerting policies
- Structured logs provide machine-readable diagnostic data

No external monitoring platform is currently required.
