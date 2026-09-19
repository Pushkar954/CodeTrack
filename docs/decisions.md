# Architectural Decisions

## ADR-001: Monorepo Structure

**Status**: Accepted
**Date**: 2026-09-19

### Decision
Use a monorepo with `client/`, `server/`, and `shared/` packages managed via npm workspaces.

### Rationale
- Shared types and utilities in one place
- Independent development of frontend and backend
- Easier dependency management
- Better code sharing between packages

### Consequences
- All packages versioned together
- Requires workspace-aware tooling
- Changes to shared affect all packages

## ADR-002: TypeScript Strict Mode

**Status**: Accepted
**Date**: 2026-09-19

### Decision
Enforce strict TypeScript across all packages with no implicit any, noUnusedLocals, and strict mode.

### Rationale
- Catches type errors early
- Improves code quality and maintainability
- Reduces runtime errors
- Essential for a production application

### Consequences
- More verbose code initially
- Requires discipline to maintain type safety
- Migration from JS is slower

## ADR-003: Vite over Create React App

**Status**: Accepted
**Date**: 2026-09-19

### Decision
Use Vite instead of Create React App for the frontend.

### Rationale
- Significantly faster development server
- Native TypeScript support
- Better build performance
- Modern tooling ecosystem

### Consequences
- Different project structure than CRA
- Requires Vite-specific configuration

## ADR-004: Modular Backend (Not Microservices)

**Status**: Accepted
**Date**: 2026-09-19

### Decision
Start with a well-structured modular monolith rather than microservices from day one.

### Rationale
- Microservices add operational complexity
- Premature microservices over-engineer the solution
- Modular monolith is easier to develop and deploy
- Can extract into services later when scale demands it

### Consequences
- Single deployment unit initially
- Clear module boundaries allow future extraction
- No need for service mesh, message queues, etc. initially

## ADR-005: API Versioning via URL Path

**Status**: Accepted
**Date**: 2026-09-19

### Decision
Use `/api/v1/` prefix for all API endpoints.

### Rationale
- Simple and discoverable
- Easy to maintain backward compatibility
- Clear distinction between versions

## ADR-006: Centralized Error Architecture

**Status**: Accepted
**Date**: 2026-09-19

### Decision
Create a custom `AppError` class hierarchy for all application errors with structured responses.

### Rationale
- Consistent error handling across the application
- Prevents leaking sensitive information
- Makes error tracking and debugging easier

## ADR-007: Clerk and AI Provider Abstraction

**Status**: Accepted
**Date**: 2026-09-19

### Decision
Keep Clerk and AI provider code isolated in `integrations/` directory, accessible only through service layer.

### Rationale
- Allows swapping providers without changing business logic
- Keeps third-party SDKs isolated
- Follows dependency inversion principle

## ADR-008: Feature-Oriented Frontend Organization

**Status**: Accepted
**Date**: 2026-09-19

### Decision
Organize frontend by features (goals, roadmap, tasks) rather than by file type.

### Rationale
- Scales better as features grow
- Each feature is self-contained
- Easier to find related code
- Supports team-based ownership of features

## ADR-009: Docker Compose for Local Development

**Status**: Accepted
**Date**: 2026-09-19

### Decision
Use Docker Compose for orchestrating client, server, and MongoDB.

### Rationale
- Consistent development environment
- Easy onboarding for new developers
- No need for Kubernetes or complex infrastructure initially

## ADR-010: No Business Logic in Phase 1

**Status**: Accepted
**Date**: 2026-09-19

### Decision
Phase 1 focuses only on architecture, configuration, and skeleton. No business features, no database schemas, no authentication.

### Rationale
- Establishes solid foundation before adding complexity
- Prevents rework when business logic is added
- Reduces risk of architectural mistakes with business code
