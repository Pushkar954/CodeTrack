# Development Guide

## Prerequisites

- Node.js v18+
- npm v9+
- MongoDB (local or Atlas)

## Quick Start

```bash
# Clone and install
git clone https://github.com/Pushkar954/CodeTrack.git
cd CodeTrack
npm run install:all

# Copy environment
cp .env.example .env
# Edit .env with your values

# Start development
npm run dev
```

## Available Scripts

### Root Level
| Command | Description |
|---------|-------------|
| `npm run dev` | Start client and server concurrently |
| `npm run build` | Build all packages |
| `npm run start` | Start server only |
| `npm run lint` | Lint all packages |
| `npm run format` | Format all packages |
| `npm run typecheck` | Type check all packages |

### Server Only
```bash
npm run dev -w server     # Dev mode with tsx
npm run build -w server   # Build TypeScript
npm run start -w server   # Start built server
npm run lint -w server    # Lint server
```

### Client Only
```bash
npm run dev -w client     # Start Vite dev server
npm run build -w client   # Build for production
npm run lint -w client    # Lint client
```

## Environment Configuration

Create `.env` from `.env.example`. Required variables:

- `NODE_ENV` - Environment (development/test/production)
- `PORT` - Server port
- `MONGO_URI` - MongoDB connection string
- `CLIENT_URL` - Frontend URL for CORS
- `LOG_LEVEL` - Logging level

The application fails fast if required environment variables are missing.

## Adding a New Feature

### Frontend
1. Create `client/src/features/{featureName}/`
2. Add pages, components, hooks, and services within
3. Register routes in `client/src/routes/Router.tsx`

### Backend
1. Create `server/src/controllers/{featureName}.ts`
2. Create `server/src/services/{featureName}Service.ts`
3. Create `server/src/repositories/{featureName}Repository.ts`
4. Create `server/src/models/{featureName}Model.ts` (Phase 2)
5. Create `server/src/routes/{featureName}Routes.ts`
6. Register in `server/src/routes/index.ts`

## Code Quality

```bash
# Check formatting
npm run format:check

# Auto-fix formatting
npm run format

# Lint and fix
npm run lint:fix

# Type check
npm run typecheck
```

## Testing

Testing architecture is prepared. Unit and integration tests will be added in future phases.

## Docker

```bash
docker-compose up --build
docker-compose down
```
