# API Conventions

## Base URL

All APIs are versioned under `/api/v1/`.

Example: `GET /api/v1/health`

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED_ERROR` | 401 | Missing or invalid authentication |
| `FORBIDDEN_ERROR` | 403 | Insufficient permissions |
| `NOT_FOUND_ERROR` | 404 | Resource not found |
| `CONFLICT_ERROR` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `EXTERNAL_SERVICE_ERROR` | 503 | Third-party service error |

## Route Organization

Routes are organized by resource under `/api/v1/`:

```
/api/v1/health          - Health check
/api/v1/auth/*          - Authentication (Phase 2)
/api/v1/goals/*         - Goals (Phase 2)
/api/v1/roadmap/*       - Roadmaps (Phase 2)
```

## Request Validation

All incoming request data is validated using Zod schemas in the `validators/` directory.

## Rate Limiting

Rate limiting is configured for all `/api` routes. Configuration will be detailed in Phase 2.

## Security

- All responses never expose stack traces in production
- API keys, tokens, and passwords are never logged or returned
- Helmet secures HTTP headers
- CORS is configured per environment
