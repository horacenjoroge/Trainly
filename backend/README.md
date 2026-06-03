# Trainly Backend

Trainly's backend is a Node.js + Express API organized around a consistent request flow:

`route -> validator -> controller -> service -> repository/model`

It is built to be reviewable as a backend engineering project, not just an app companion API. The current backend includes OpenAPI docs, operational endpoints, centralized validation and error handling, structured logging, optional Redis integration, seed data, and a full backend docs set under `docs/backend/`.

## Architecture Summary

Canonical runtime path:

- `src/server.js` - process entrypoint, database boot, event registration, graceful shutdown
- `src/app.js` - Express app, middleware stack, docs, observability, and route mounting

Core structure:

- `src/api/routes` - route definitions
- `src/api/controllers` - HTTP orchestration
- `src/api/validators` - Zod request schemas
- `src/services` - business logic
- `src/repositories` - database access
- `src/core` - config, logger, tracing, errors
- `src/infrastructure` - cache, storage, messaging integrations
- `src/middleware` - auth, security, request logging, upload, error handling
- `src/events` - event-driven side effects
- `src/scripts` - seed data and demo helpers

Operational conventions:

- authenticated routes use `x-auth-token`
- request logs use `pino` with `x-trace-id`
- health is exposed at `/api/health`
- Prometheus-style metrics are exposed at `/metrics`

## Setup

Install dependencies:

```bash
cd backend
npm install
```

Create a local `.env`:

```bash
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/trainly
JWT_SECRET=replace-me
REFRESH_TOKEN_SECRET=replace-me
REDIS_URL=
CORS_ORIGIN=*
STORAGE_TYPE=local
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100
SOS_RATE_LIMIT_MAX=5
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

## Environment Variables

Required:

- `MONGODB_URI`
- `JWT_SECRET`
- `PORT`

Recommended:

- `REFRESH_TOKEN_SECRET`
- `CORS_ORIGIN`
- `LOG_LEVEL`
- `STORAGE_TYPE`

Optional integrations and hardening:

- `REDIS_URL`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`
- `SOS_RATE_LIMIT_MAX`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

## Run Instructions

Start the API:

```bash
npm start
```

Run tests:

```bash
npm test
```

Seed demo data:

```bash
npm run seed
```

The server runs on `http://localhost:3000` by default unless `PORT` is overridden.

## Swagger and OpenAPI

Once the backend is running:

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/openapi.json`
- ReDoc: `http://localhost:3000/redoc`

Notes:

- authenticated endpoints use the `x-auth-token` header
- Swagger UI and ReDoc use CDN-hosted frontend assets
- the raw OpenAPI document is served locally by the backend

## Health and Metrics

Operational endpoints:

- Health: `http://localhost:3000/api/health`
- Metrics: `http://localhost:3000/metrics`

`/api/health` reports:

- API status
- MongoDB connection state
- Redis enabled and connected state
- storage mode
- uptime and memory
- in-process metrics snapshot

`/metrics` exposes Prometheus-style metrics including:

- request count
- error count
- request latency
- upload success and failure counts
- cache hit, miss, skip, and error counts

## Seed and Demo Instructions

For a fast reviewer flow:

```bash
cd backend
npm install
npm run seed
npm start
```

Then use:

- Swagger UI: `http://localhost:3000/docs`
- Health: `http://localhost:3000/api/health`
- Metrics: `http://localhost:3000/metrics`
- Demo request file: `src/scripts/demo-requests.http`

The seed script creates realistic demo users, workouts, posts, follows, achievements, contacts, and an SOS event.

## Backend Docs

Full backend documentation lives in [docs/backend/README.md](/Users/la/Desktop/Repository/horacenjoroge/Trainly/docs/backend/README.md:1), including:

- architecture
- API guide
- data model
- auth flow
- workout flow
- social flow
- SOS flow
- storage flow
- deployment
- developer guide
- demo guide
- troubleshooting

## Key Backend Engineering Features

- clean `src/`-based backend structure with one canonical runtime path
- centralized validation, async handling, and app errors
- `pino` logging with correlation IDs
- app-wide security middleware with `helmet`, CORS, and rate limiting
- OpenAPI schema generation plus Swagger UI and ReDoc
- health and metrics endpoints for operational readiness
- optional Redis support with graceful fallback for local development
- seed data and demo request helpers for quick evaluation

## Request Flow Conventions

The backend follows these conventions consistently:

- input validation happens in `src/api/validators`
- HTTP orchestration lives in `src/api/controllers`
- business logic lives in `src/services`
- persistence access lives in `src/repositories`
- errors are normalized by centralized middleware
- logging uses `pino` with request trace context
