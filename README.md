# GoalForge AI

> **AI-Powered Goal Planning and Execution Platform**

GoalForge AI is an intelligent platform that helps users plan, track, and achieve their learning goals. Whether you want to master DSA, learn MERN, prepare for interviews, or build any skill — GoalForge AI creates personalized roadmaps and daily tasks.

## Architecture Overview

GoalForge AI follows a **monorepo architecture** with a modular backend and a scalable frontend.

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: Clerk (Phase 2)
- **AI**: Provider-abstracted (Phase 2)

## Folder Structure

```
goalforge-ai/
├── client/              # React frontend (Vite + TypeScript)
│   └── src/
│       ├── app/         # App initialization and providers
│       ├── assets/      # Static assets
│       ├── components/  # UI and common components
│       ├── features/    # Feature-based modules (auth, goals, etc.)
│       ├── layouts/     # Layout wrappers
│       ├── pages/       # Page-level components
│       ├── routes/      # Route definitions
│       ├── hooks/       # Custom React hooks
│       ├── lib/         # Library configurations
│       ├── services/    # API service functions
│       ├── types/       # TypeScript type definitions
│       ├── schemas/     # Form validation schemas (Zod)
│       ├── utils/       # Utility functions
│       ├── constants/   # App constants
│       ├── App.tsx
│       └── main.tsx
│
├── server/              # Express backend (TypeScript)
│   └── src/
│       ├── config/      # Environment and database config
│       ├── controllers/ # HTTP request/response handlers
│       ├── services/    # Business logic
│       ├── repositories/# Database access layer
│       ├── models/      # Mongoose persistence models
│       ├── routes/      # API route definitions
│       ├── middleware/  # Auth, error handling, etc.
│       ├── validators/  # Request validation (Zod)
│       ├── integrations/# External services (Clerk, AI)
│       ├── types/       # TypeScript type definitions
│       ├── utils/       # Utility functions
│       ├── constants/   # App constants
│       ├── errors/      # Custom error classes
│       ├── app.ts       # Express app configuration
│       └── server.ts    # Server entry point
│
├── shared/              # Shared types and utilities
│   └── src/
│       ├── types/       # Shared TypeScript types
│       ├── constants/   # Shared constants
│       └── utils/       # Shared utilities
│
├── docs/                # Documentation
│   ├── architecture.md
│   ├── development.md
│   ├── api-conventions.md
│   └── decisions.md
│
├── .github/             # GitHub Actions workflows
├── .env.example         # Environment variable template
├── .gitignore
├── .editorconfig
├── docker-compose.yml
├── package.json
└── README.md
```

## Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- A Clerk application (create at [Clerk Dashboard](https://dashboard.clerk.com))

## Local Setup

```bash
# Clone the repository
git clone https://github.com/Pushkar954/CodeTrack.git
cd CodeTrack

# Install all dependencies
npm run install:all

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Set up Clerk
# 1. Create a Clerk application at https://dashboard.clerk.com
# 2. Copy the Secret Key and Publishable Key
# 3. Add CLERK_SECRET_KEY and VITE_CLERK_PUBLISHABLE_KEY to .env

# Start the development server
npm run dev
```

The app will be available at:
- **Client**: http://localhost:3000
- **API**: http://localhost:5000/api/v1

## Authentication Architecture

GoalForge AI uses **Clerk** for authentication. Clerk handles identity, sessions, and sign-in/sign-up flows. The backend verifies Clerk JWT tokens on every request.

### How Authentication Works

1. **Frontend**: Clerk React SDK provides `ClerkProvider`, `useAuth`, `SignIn`, and `SignUp` components
2. **Client-side**: User signs in via Clerk's pre-built SignIn/SignUp pages
3. **API Requests**: Frontend sends Clerk JWT token in the `Authorization: Bearer <token>` header
4. **Backend**: `clerkMiddleware()` verifies the JWT and attaches `req.auth`
5. **User Lookup**: `authenticateRequest` middleware maps `req.auth.userId` to the MongoDB User by `clerkUserId`
6. **Authorization**: `req.user` contains the authenticated application user

### Clerk to MongoDB Mapping

- **Clerk**: Manages identity, authentication, sessions
- **MongoDB User**: Stores application-specific data linked by `clerkUserId`
  - `clerkUserId` (unique index): Links to Clerk user ID
  - `name`, `email`, `profileImage`: Synced from Clerk on first sign-in

### Required Environment Variables

| Variable | Side | Description |
|----------|------|-------------|
| `CLERK_SECRET_KEY` | Server | Clerk secret key for JWT verification |
| `VITE_CLERK_PUBLISHABLE_KEY` | Client | Clerk publishable key for ClerkProvider |

### Protected Routes

- Unauthenticated users are redirected to `/sign-in`
- `/tasks` and `/tasks/new` require authentication
- Backend endpoints return `401` for unauthenticated requests

### API Endpoints

- `GET /api/v1/auth/me` - Returns the authenticated user
- `GET /api/v1/tasks` - Lists user's tasks (requires auth)
- `POST /api/v1/tasks` - Creates a new task (requires auth)

## Development Commands

```bash
# Start both client and server
npm run dev

# Start server only
npm run start -w server

# Start client only
npm run dev -w client

# Build all packages
npm run build

# Lint all packages
npm run lint

# Format all packages
npm run format

# Type check
npm run typecheck
```

## Environment Variables

See `.env.example` for all required environment variables.

## API Versioning

All APIs are versioned under `/api/v1/`.

## Architecture

- **Dependency Flow**: Routes → Controllers → Services → Repositories → Models
- **External Integrations**: Accessed through service/integration abstractions
- **Error Handling**: Centralized error handling with structured responses
- **Security**: Helmet, CORS, request body limits
- **Logging**: Structured logging with different log levels

## License

MIT
