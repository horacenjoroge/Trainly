# Deployment

## Runtime Model

The backend is packaged as a Node.js service with MongoDB as the primary data store and optional Redis for cache/token blacklist support.

Canonical runtime:

- `backend/src/server.js`

## Container Image

Source:

- `backend/Dockerfile`

Production image behavior:

- uses `node:20-alpine`
- installs production dependencies with `npm ci --only=production`
- copies `src`, `models`, and `public`
- starts with `node src/server.js`
- exposes port `3000`
- includes a healthcheck against `/api/health`

Development image behavior:

- installs `nodemon`
- starts with `nodemon src/server.js`

## Docker Compose

### Development Compose

Source:

- `backend/docker-compose.dev.yml`

Behavior:

- runs API in development mode
- mounts `src`, `models`, and `public`
- persists uploaded files in a Docker volume
- boots MongoDB alongside the API

### General Compose

Source:

- `backend/docker-compose.yml`

Behavior:

- supports API + MongoDB
- includes an optional Redis service behind the `with-redis` profile
- restarts services unless stopped

## Required Environment Variables

Required:

- `MONGODB_URI`
- `JWT_SECRET`

Recommended:

- `REFRESH_TOKEN_SECRET`
- `CORS_ORIGIN`
- `LOG_LEVEL`

Optional integrations:

- `REDIS_URL`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `STORAGE_TYPE`

## Health and Readiness

Health endpoint:

- `GET /api/health`

Current payload includes:

- status
- current time
- environment
- database connection status
- version
- redis enabled/connected state
- storage mode
- process memory summary
- in-process metrics snapshot

Metrics endpoint:

- `GET /metrics`

Current metrics include:

- total requests
- total errors
- request latency histogram
- upload success/failure totals
- cache hit/miss/skip/error totals

## Deployment Caveats

- `STORAGE_TYPE=s3` is not fully implemented yet and falls back to local storage
- Swagger/ReDoc pages load frontend assets from a CDN
- Redis is optional; if absent, blacklist/rate-limit cache behavior degrades safely
- `/metrics` is process-local in-memory telemetry; values reset on restart

## Suggested Deployment Checklist

1. Set `MONGODB_URI`
2. Set `JWT_SECRET`
3. Set `REFRESH_TOKEN_SECRET`
4. Configure `CORS_ORIGIN`
5. Configure `REDIS_URL` if you want blacklist and cache support
6. Configure Twilio credentials if SOS should send real SMS
7. Verify `/api/health`
8. Verify `/metrics`
9. Verify `/docs` and `/openapi.json`
