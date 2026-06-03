# Developer Guide

## Local Setup

```bash
cd backend
npm install
npm start
```

For hot reload:

```bash
cd backend
npm run dev
```

## Testing

Current backend tests run with Node's built-in test runner:

```bash
cd backend
npm test
```

## Coding Conventions

The backend now standardizes on this flow:

1. route
2. validator
3. controller
4. service
5. repository
6. model/infrastructure

### Add a New Endpoint

Recommended sequence:

1. add or update a validator in `src/api/validators`
2. add a controller handler in `src/api/controllers`
3. add business logic in `src/services`
4. add repository methods in `src/repositories` if persistence is involved
5. register the route in `src/api/routes`
6. update `src/docs/openapi.js`
7. add or update tests

## Logging

Use:

- `backend/src/core/logger`

Do not use:

- `console.log`

The logger automatically includes trace context when available.

## Errors

Use structured errors from:

- `backend/src/core/errors/AppError.js`

Prefer:

- `ValidationError`
- `AuthError`
- `NotFoundError`
- `ConflictError`
- `RateLimitError`

Controllers should rely on:

- `asyncHandler`
- centralized `errorHandler`

## Security

Protected routes should use:

- `authMiddleware`

Request validation should use:

- `validateRequest(...)`

Uploads should use:

- `imageUpload`

## Docs Workflow

OpenAPI source lives in:

- `backend/src/docs/openapi.js`

Backend docs index lives in:

- `docs/backend/README.md`

Whenever you add or change a route:

- update OpenAPI
- update any affected backend docs
- check whether the root `README.md` needs a new link or note

## Useful Runtime Checks

- `GET /api/health`
- `GET /docs`
- `GET /openapi.json`

## Current Architectural Notes

- root `backend/models` are still the active schema source
- root-level legacy routes/controllers are no longer the canonical runtime
- `src` is the source of truth for active request handling
