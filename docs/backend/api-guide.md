# API Guide

## Base URLs

Typical local development URLs:

- API: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/docs`
- OpenAPI schema: `http://localhost:3000/openapi.json`
- ReDoc: `http://localhost:3000/redoc`
- Health: `http://localhost:3000/api/health`
- Metrics: `http://localhost:3000/metrics`

## Authentication Header

Authenticated endpoints expect:

```http
x-auth-token: <jwt-access-token>
```

The backend does not currently use a `Bearer` token convention in the active auth middleware. It reads `x-auth-token`.

## Response Style

Response shapes vary by feature area.

Common patterns:

- plain resource payloads for some user/contact endpoints
- `{ status: 'success', data: ... }` for workouts and achievements
- structured error payloads from centralized error middleware

Standard error format:

```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "meta": {
    "errors": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## Route Groups

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/user`
- `POST /api/auth/logout`

### Users

- `GET /api/users/profile`
- `PUT /api/users/profile`
- `PUT /api/users/stats`
- `GET /api/users/fullprofile`
- `POST /api/users/avatar`
- `GET /api/users/followers`
- `GET /api/users/following`
- `POST /api/users/follow/:userId`
- `DELETE /api/users/follow/:userId`
- `GET /api/users/achievements`
- `GET /api/users/search`
- `GET /api/users/search/:query`
- `GET /api/users/:id`

### Workouts

- `GET /api/workouts/public/feed`
- `POST /api/workouts`
- `GET /api/workouts`
- `GET /api/workouts/stats/summary`
- `GET /api/workouts/:id`
- `PATCH /api/workouts/:id`
- `DELETE /api/workouts/:id`
- `POST /api/workouts/:id/like`
- `POST /api/workouts/:id/comments`

### Posts / Feed

- `GET /api/posts`
- `POST /api/posts`
- `PUT /api/posts/:id/like`
- `POST /api/posts/:id/comments`
- `GET /api/posts/:id/comments`

### Follows

- `POST /api/follow/:userId`
- `DELETE /api/follow/:userId`
- `GET /api/follow/followers`
- `GET /api/follow/following`

### Achievements

- `GET /api/achievements`
- `GET /api/achievements/progress`
- `GET /api/achievements/leaderboard`

### Uploads

- `POST /api/uploads/avatar`
- `POST /api/uploads/post`

### Contacts and SOS

- `GET /api/contacts`
- `POST /api/contacts`
- `PUT /api/contacts/:id`
- `DELETE /api/contacts/:id`
- `POST /api/contacts/send-sos`

### Observability

- `GET /api/health`
- `GET /metrics`

## Examples

### Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Horace Njoroge",
    "email": "horace@example.com",
    "password": "Password123"
  }'
```

### Create Workout

```bash
curl -X POST http://localhost:3000/api/workouts \
  -H 'Content-Type: application/json' \
  -H 'x-auth-token: <token>' \
  -d '{
    "type": "Running",
    "duration": 3600,
    "calories": 640,
    "distance": 10000,
    "privacy": "public",
    "running": {
      "distance": 10000
    }
  }'
```

### Upload Avatar

```bash
curl -X POST http://localhost:3000/api/uploads/avatar \
  -H 'x-auth-token: <token>' \
  -F 'image=@avatar.jpg'
```

## Docs Source of Truth

For machine-readable docs, use:

- `/openapi.json`

For interactive docs, use:

- `/docs`
- `/redoc`
