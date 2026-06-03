# Demo Guide

## Goal

This guide helps a reviewer get meaningful backend data into Trainly quickly.

It seeds:

- demo users
- workouts
- posts
- follow relationships
- achievements
- emergency contacts
- an SOS audit event

## Seed Command

From the backend directory:

```bash
cd backend
npm run seed
```

The seed script is:

- `backend/src/scripts/seed.js`

It is safe to rerun for the seeded demo users. The script removes previous demo records for those accounts before recreating them.

## Prerequisites

The script needs:

- MongoDB running
- `MONGODB_URI` set in `backend/.env`

Recommended minimum `.env` values:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/trainly
JWT_SECRET=replace-me
REFRESH_TOKEN_SECRET=replace-me
PORT=3000
```

## Fastest Review Path

### 1. Start MongoDB

Using Docker Compose:

```bash
cd backend
docker compose up -d mongodb
```

### 2. Seed demo data

```bash
cd backend
npm run seed
```

### 3. Start the API

```bash
cd backend
npm run dev
```

### 4. Open the API docs

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/openapi.json`
- ReDoc: `http://localhost:3000/redoc`

## Demo Accounts

Default password for all seeded accounts:

- `Password123`

Accounts:

- `horace.demo@trainly.dev`
- `amina.demo@trainly.dev`
- `david.demo@trainly.dev`
- `grace.demo@trainly.dev`

## What the Seed Creates

The current script creates:

- 4 users
- 7 workouts
- 3 posts
- 4 follow relationships
- 5 achievements
- 4 emergency contacts
- 1 SOS event

The data is intentionally cross-linked so a reviewer can immediately see:

- public workouts in the feed
- social posts with likes and comments
- follower/following relationships
- achievements tied to workouts
- emergency contacts and SOS history

## Ready-to-Run Request File

A REST Client request collection lives at:

- `backend/src/scripts/demo-requests.http`

It includes:

- health check
- login
- current-user lookup
- workout list and stats
- public feed
- post creation
- achievements lookup
- contacts lookup
- SOS trigger

## Curl Snippets

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "horace.demo@trainly.dev",
    "password": "Password123"
  }'
```

### View Public Workout Feed

```bash
curl http://localhost:3000/api/workouts/public/feed?page=1&limit=10
```

### View Achievements

```bash
curl http://localhost:3000/api/achievements?page=1&limit=10 \
  -H 'x-auth-token: <token>'
```

### Trigger Demo SOS

```bash
curl -X POST http://localhost:3000/api/contacts/send-sos \
  -H 'Content-Type: application/json' \
  -H 'x-auth-token: <token>' \
  -d '{
    "location": {
      "latitude": -1.286389,
      "longitude": 36.817223
    },
    "message": "Reviewer-triggered demo SOS."
  }'
```

## Reviewer Tips

- Start with `horace.demo@trainly.dev` for the richest profile
- Use `/docs` to inspect endpoints while looking at seeded data
- Check `/api/workouts/public/feed` and `/api/posts` first to confirm the social surface
- Check `/api/contacts` and `/api/contacts/send-sos` to validate emergency flows
