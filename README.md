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

# Start the development server
npm run dev
```

The app will be available at:
- **Client**: http://localhost:3000
- **API**: http://localhost:5000/api/v1

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
