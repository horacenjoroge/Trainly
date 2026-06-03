# Troubleshooting

## Server Fails on Startup

### Missing environment variables

Symptoms:

- process exits quickly
- config validation errors

Checks:

- ensure `MONGODB_URI` is set
- ensure `JWT_SECRET` is set

Relevant code:

- `backend/src/core/config/index.js`

### MongoDB connection fails

Symptoms:

- startup exits after connection attempt
- health endpoint never becomes available

Checks:

- verify `MONGODB_URI`
- confirm MongoDB is reachable from the host/container

Relevant code:

- `backend/src/server.js`

## Auth Problems

### Protected route says token is missing

Cause:

- the active auth middleware reads `x-auth-token`

Fix:

- send `x-auth-token: <jwt>`

Relevant code:

- `backend/src/middleware/auth.js`

### Refresh tokens do not seem to revoke

Cause:

- Redis is optional
- without `REDIS_URL`, blacklist operations degrade safely

Fix:

- configure Redis if refresh-token revocation guarantees matter

Relevant code:

- `backend/src/infrastructure/cache/index.js`

### Cache metrics show mostly skips

Cause:

- Redis is not configured, so cache-backed operations are intentionally bypassed

Fix:

- set `REDIS_URL`

Operational note:

- `/metrics` will then show cache hits/misses instead of mostly cache skips

## Upload Problems

### Image upload rejected

Possible causes:

- file is larger than 10 MB
- file MIME type is not image/*

Relevant code:

- `backend/src/middleware/upload.js`

### Files disappear after redeploy

Cause:

- local storage writes into `public/uploads`
- without persistent volume/storage, files are ephemeral

Fix:

- persist the uploads directory
- or implement real remote storage backing

## SOS Problems

### SOS returns no real SMS result

Cause:

- Twilio credentials are not configured

Current behavior:

- messaging adapter returns simulated status

Relevant code:

- `backend/src/infrastructure/messaging/twilio.js`

### SOS rate limits feel ineffective

Cause:

- cache layer falls back safely when Redis is absent

Fix:

- configure `REDIS_URL`

## Data / Query Problems

### Contacts cannot reuse the same phone number across users

Cause:

- the `Contact` schema marks `phoneNumber` as globally unique

Relevant code:

- `backend/models/contact.js`

## Docs Problems

### Swagger UI loads but appears blank

Possible causes:

- CDN asset loading is blocked
- `/openapi.json` is failing

Checks:

- open `/openapi.json` directly
- verify outbound browser access to `unpkg.com`

Relevant code:

- `backend/src/api/routes/docs.routes.js`

### Health endpoint returns degraded

Common cause:

- MongoDB is disconnected, so `/api/health` responds with `503`

Checks:

- inspect `database.readyState`
- verify `MONGODB_URI`
- confirm MongoDB is reachable

### Metrics look empty after restart

Cause:

- metrics are stored in process memory

Implication:

- counters reset on each restart or redeploy

### OpenAPI docs do not match a changed route

Fix:

- update `backend/src/docs/openapi.js`
- update `docs/backend/*` where needed

## Suggested Debug Endpoints

- `/api/health`
- `/metrics`
- `/openapi.json`
- `/docs`
