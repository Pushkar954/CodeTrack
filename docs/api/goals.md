# Goal Management API

## Overview
The Goal Management API provides CRUD operations for user goals with a full status lifecycle management system. All endpoints are prefixed with `/api/v1/goals`.

## Authentication
All Goal endpoints require Clerk authentication via the `authenticateRequest` and `requireAuthenticated` middleware. A valid `clerkUserId` must be present in the request.

## Base URL
```
/api/v1/goals
```

## Models

### Goal
| Field               | Type   | Description                          |
|---------------------|--------|--------------------------------------|
| `id`                | string | Unique identifier (24-char hex)      |
| `userId`            | string | Owner's user ID                      |
| `title`             | string | Goal title (max 200 chars)           |
| `description`       | string | Goal description (max 2000 chars)    |
| `category`          | string | One of: DSA, SYSTEM DESIGN, CODING INTERVIEWS, LANGUAGE LEARNING, OTHER |
| `currentLevel`      | string | One of: BEGINNER, INTERMEDIATE, ADVANCED, INTERVIEW_READY |
| `targetLevel`       | string | One of: BEGINNER, INTERMEDIATE, ADVANCED, INTERVIEW_READY |
| `durationDays`      | number | Duration in days (1-365)             |
| `dailyStudyMinutes` | number | Daily study minutes (5-480)          |
| `preferredLanguage` | string | One of: JAVA, PYTHON, JAVASCRIPT, TYPESCRIPT, C++, OTHER |
| `preferredPlatform` | string | One of: LEETCODE, HACKERRANK, CODEFORCES, CODEARCHITECT, OTHER |
| `status`            | string | Current lifecycle status             |
| `progress`          | number | Progress percentage (0-100)          |
| `startDate`         | date   | Goal start date                      |
| `endDate`           | date   | Goal end date                        |
| `archivedAt`        | date   | Timestamp when goal was archived     |
| `createdAt`         | date   | Creation timestamp                   |
| `updatedAt`         | date   | Last update timestamp                |

### Goal Status Lifecycle
```
DRAFT → ACTIVE → PAUSED → COMPLETED → ARCHIVED
           ↓         ↓         ↓
         ARCHIVED ← ARCHIVED ← ARCHIVED
```

**Valid transitions:**
| From        | To                              |
|-------------|---------------------------------|
| DRAFT       | ACTIVE                          |
| ACTIVE      | PAUSED, COMPLETED, ARCHIVED     |
| PAUSED      | ACTIVE, ARCHIVED                |
| COMPLETED   | ARCHIVED                        |
| ARCHIVED    | (none - goal is immutable)      |

## Endpoints

### Create Goal
```
POST /api/v1/goals
```
**Headers:** `Authorization: Bearer <clerk_token>`

**Request Body:**
```json
{
  "title": "Learn TypeScript",
  "description": "Complete TypeScript course",
  "category": "LANGUAGE LEARNING",
  "currentLevel": "BEGINNER",
  "targetLevel": "INTERMEDIATE",
  "durationDays": 30,
  "dailyStudyMinutes": 60,
  "preferredLanguage": "TYPESCRIPT",
  "preferredPlatform": "LEETCODE",
  "status": "DRAFT",
  "progress": 0,
  "startDate": "2025-01-01T00:00:00Z",
  "endDate": "2025-01-31T00:00:00Z"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "goal": { ... }
  }
}
```

**Validation Errors:**
- `400` - `BAD_REQUEST`: End date before start date, dailyStudyMinutes out of range, targetLevel not higher than currentLevel, duration must be positive

**Business Errors:**
- `404` - `NOT_FOUND`: User not found

### List Goals
```
GET /api/v1/goals
```
**Query Parameters:**
| Parameter | Type   | Default | Description                    |
|-----------|--------|---------|--------------------------------|
| `page`    | number | 1       | Page number                    |
| `limit`   | number | 20      | Items per page (max 100)       |
| `status`  | string | -       | Filter by status               |
| `sortBy`  | string | createdAt | Field to sort by            |
| `sortOrder` | string | desc    | Sort order (asc/desc)          |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "goals": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

**Business Errors:**
- `404` - `NOT_FOUND`: User not found

### Get Goal by ID
```
GET /api/v1/goals/:id
```
**Path Parameters:**
| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| `id`      | string | Goal ID (24-char hex) |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "goal": { ... }
  }
}
```

**Errors:**
- `404` - `NOT_FOUND`: Goal not found or does not belong to user

### Update Goal
```
PATCH /api/v1/goals/:id
```
**Path Parameters:**
| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| `id`      | string | Goal ID             |

**Request Body (partial):**
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "goal": { ... }
  }
}
```

**Errors:**
- `404` - `NOT_FOUND`: Goal not found or user not found
- `409` - `CONFLICT`: Cannot modify archived goal

### Archive Goal
```
DELETE /api/v1/goals/:id
```
**Path Parameters:**
| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| `id`      | string | Goal ID             |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Goal archived"
  }
}
```

**Errors:**
- `404` - `NOT_FOUND`: Goal not found or user not found
- `409` - `CONFLICT`: Goal is already archived

### Change Goal Status
```
POST /api/v1/goals/:id/status
```
**Path Parameters:**
| Parameter | Type   | Description         |
|-----------|--------|---------------------|
| `id`      | string | Goal ID             |

**Request Body:**
```json
{
  "status": "ACTIVE"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "goal": { ... }
  }
}
```

**Errors:**
- `404` - `NOT_FOUND`: Goal not found or user not found
- `409` - `CONFLICT`: Invalid status transition

## Error Codes

| Code                      | HTTP Status | Description                          |
|---------------------------|-------------|--------------------------------------|
| `GOAL_NOT_FOUND`          | 404         | Goal not found                       |
| `GOAL_INVALID_STATE`      | 409         | Invalid status transition            |
| `GOAL_INVALID_DATES`      | 400         | Invalid date range                   |
| `GOAL_INVALID_DURATION`   | 400         | Invalid duration or study minutes    |
| `GOAL_UPDATE_NOT_ALLOWED` | 409         | Cannot modify archived goal          |
| `GOAL_ALREADY_ARCHIVED`   | 409         | Goal is already archived             |
| `GOAL_DUPLICATE`          | 409         | Duplicate goal detected              |

## Business Rules

1. **User Ownership**: Goals are owned by the authenticated user. Users can only access, modify, or archive their own goals.
2. **Status Transitions**: Goals can only transition through valid status states as defined in the lifecycle table above.
3. **Archived Goals**: Once a goal is archived, it cannot be modified or have its status changed.
4. **Date Validation**: End date must be after start date.
5. **Study Minutes**: Daily study minutes must be between 5 and 480 (inclusive).
6. **Level Progression**: Target level must be higher than current level.
7. **Soft Delete**: Goals are never hard-deleted. Archives are tracked via `archivedAt` timestamp.

## Rate Limiting
All Goal endpoints are subject to the global rate limiter configuration.

## Response Format

### Success
```json
{
  "success": true,
  "data": {
    "goal": { ... }
  }
}
```

### Paginated Success
```json
{
  "success": true,
  "data": {
    "goals": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "GOAL_NOT_FOUND",
    "message": "Goal not found",
    "requestId": "req-123"
  }
}
```
