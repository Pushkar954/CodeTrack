# GoalForge AI - Security Documentation

## Authentication

GoalForge AI uses **Clerk** as the authentication provider. Clerk handles:
- User identity and registration
- Session management
- JWT token issuance
- Sign-in/sign-up flows

The backend never handles passwords or generates custom JWTs.

### Authentication Flow

1. Client signs in via Clerk's pre-built SignIn page
2. Clerk issues a session JWT
3. Frontend sends JWT in `Authorization: Bearer <token>` header
4. Backend verifies JWT via `@clerk/express` `clerkMiddleware()`
5. `authenticateRequest` middleware maps `req.auth.userId` to MongoDB User
6. `req.user` contains the authenticated application user

### Never Trust User-Supplied IDs

The backend NEVER trusts:
- `req.body.userId`
- `req.params.userId`
- Query parameters for user identity

All user identity comes from verified Clerk authentication.

## Authorization

Authorization ("Can this user perform this operation?") is handled by the `authorization.ts` utility:

```typescript
getAuthContext(req)  // Returns { clerkUserId, userId, sessionId }
requireOwnership(resourceUserId, authContext)  // Returns boolean
```

Future modules use `requireOwnership` to enforce `resource.userId === authContext.userId`.

## CORS Configuration

CORS is configured with an allowlist of frontend origins:
- Origin must match `CLIENT_URL` from environment configuration
- Wildcard (`*`) is never used for authenticated APIs
- Credentials are enabled for cookie-based flows

## Rate Limiting

Rate limiting is enforced at the infrastructure level:
- Default: 100 requests per minute per IP
- Configurable limits for different environments
- Architecture supports replacement with Redis-backed rate limiting

## Request Body Limits

Request bodies are limited to 10KB to prevent denial-of-service attacks.

## Error Responses

Error responses never expose:
- Stack traces
- Database error messages
- Mongoose internals
- Clerk internal details
- API keys or secrets

Production errors return generic messages; development errors may include additional context.

## Secret Management

- `CLERK_SECRET_KEY` is server-side only
- `CLERK_PUBLISHABLE_KEY` is safe for the client
- Secrets are never committed to the repository
- All configuration comes from `.env` files

## Helmet

Helmet secures HTTP headers:
- Prevents XSS, clickjacking, MIME sniffing
- Sets secure headers automatically

## Logging Security

Logs never contain:
- Passwords
- Authorization headers
- Clerk tokens
- API keys
- Sensitive personal information

## Graceful Shutdown

The application handles SIGTERM and SIGINT gracefully:
1. Stops accepting new requests
2. Allows active requests to complete
3. Closes MongoDB connections
4. Exits cleanly

## Future Security Considerations

- Add CSRF protection if using cookies
- Add content security policy headers
- Consider adding request signing for internal services
- Add audit logging for sensitive operations
