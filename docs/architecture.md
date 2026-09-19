# GoalForge AI - Architecture Documentation

## Overview

GoalForge AI is an AI-powered goal planning and execution platform built as a modular monolith.

## Architecture Pattern

- **Monorepo**: Single repository containing `client`, `server`, and `shared` packages
- **Modular Monolith**: Backend is organized into distinct modules with clear boundaries
- **Feature-Oriented Frontend**: Frontend organized by features that can scale independently

## Dependency Flow

```
Routes → Controllers → Services → Repositories → Models
```

External services (Clerk, AI providers) are accessed through integration abstractions in the Services layer.

## Frontend Architecture

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Forms**: React Hook Form + Zod validation

The frontend follows a feature-based structure where each feature (goals, roadmap, tasks, etc.) is self-contained.

## Backend Architecture

- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB with Mongoose
- **API Versioning**: `/api/v1/`

### Layer Responsibilities

| Layer | Responsibility |
|-------|---------------|
| Routes | Define endpoints, connect middleware/controllers |
| Controllers | Handle HTTP requests/responses only |
| Services | Business logic, coordinate repositories and integrations |
| Repositories | Database access |
| Models | Mongoose persistence models |

### Controllers (Thin)
- Handle HTTP request/response
- Validate input via Zod validators
- Delegate to services
- Never contain business logic

### Services (Business Logic)
- Contain all business logic
- Coordinate repositories and external integrations
- Are the core of the application

### Repositories (Database Access)
- Handle all database operations
- Prevent DB logic from spreading across services/controllers

## External Integrations

### Clerk (Authentication)
- Isolated in `server/src/integrations/clerk/`
- Accessed only through service layer
- Not yet implemented (Phase 2)

### AI Provider
- Abstracted in `server/src/integrations/ai/`
- Provider-agnostic interface
- Not yet implemented (Phase 2)

## Error Handling

Centralized error handling with `AppError` hierarchy:
- All errors extend `AppError` with `statusCode`, `code`, `isOperational`
- Structured error responses: `{ success: false, error: { code, message } }`
- Never expose stack traces or internals in production

## Response Format

Success: `{ success: true, data: {} }`
Error: `{ success: false, error: { code: "...", message: "..." } }`

## Security Foundation

- Helmet for HTTP headers
- CORS configured per environment
- Request body limits (10kb)
- Rate limiting prepared for Phase 2
- No secrets hardcoded anywhere

## Logging

- Structured logging with configurable levels
- Development-friendly and production-friendly output
- Never logs passwords, tokens, or API keys

## Graceful Shutdown

Handles SIGTERM, SIGINT, uncaught exceptions, and unhandled rejections:
- Closes HTTP server
- Closes MongoDB connection
- Exits cleanly

## Docker

Docker Compose orchestrates:
- Client (frontend)
- Server (backend)
- MongoDB database

## Future Scalability

The architecture supports eventual extraction into microservices without major refactoring.
