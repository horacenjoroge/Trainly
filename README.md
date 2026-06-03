# Trainly

<div align="center">

[![Kotlin](https://img.shields.io/badge/Kotlin-2.0.21-purple.svg)](https://kotlinlang.org/)
[![Jetpack Compose](https://img.shields.io/badge/Compose-BOM%202024.12.01-green.svg)](https://developer.android.com/jetpack/compose)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*A fitness platform with a Kotlin Android client and a production-oriented Node.js backend.*

</div>

---

## Overview

**Trainly** combines a modern Android app with a backend designed around clear service boundaries, operational visibility, and realistic product flows. The platform covers workout tracking, social interactions, progress analytics, emergency safety, and media uploads.

The repository now presents strongly from both sides:
- an Android client built with Kotlin and Jetpack Compose
- a Node.js + Express backend with OpenAPI docs, centralized validation and errors, structured logging, health checks, metrics, seed data, and backend architecture docs

### Key Highlights
- **Workout tracking flows** for running, cycling, swimming, gym, walking, and hiking
- **Social platform features** including posts, follows, feed interactions, and achievements
- **Emergency safety workflows** with contacts and SOS escalation
- **Operational backend story** with `/api/health`, `/metrics`, `pino` logging, rate limiting, and OpenAPI docs
- **Reviewer-friendly setup** with seed data, demo requests, and backend architecture docs

---

## Features

### Workout Tracking
- **Multiple activity types** with structured workout creation and history
- **GPS route tracking** with validation in the backend request flow
- **Performance metrics** including duration, distance, calories, and stats summaries
- **Workout analytics** backed by persisted history and achievement side effects

### Social Features
- **Posts and feed interactions** for progress sharing
- **Follow system** for community and profile relationships
- **Achievement tracking** with milestone-style rewards
- **Public and user-specific activity views**

### Safety Features
- **Emergency contacts** managed through authenticated APIs
- **SOS flow** with storage of emergency events and messaging integration points
- **Location-aware emergency payloads**

### Backend Engineering Features
- **OpenAPI / Swagger / ReDoc** documentation
- **Consistent request flow**: `route -> validator -> controller -> service -> repository/model`
- **Centralized config, logging, and app errors**
- **Health and Prometheus-style metrics endpoints**
- **Optional Redis integration** with graceful local fallback
- **Seed data and demo request scripts** for fast review

---

## Tech Stack

### Frontend (Android App)
- **Kotlin** 100%
- **Jetpack Compose**
- **Material 3**
- **Navigation Compose**
- **Hilt**
- **Retrofit**
- **Room**
- **Coil**
- **Google Maps**
- **DataStore**
- **Paging 3**

### Backend
- **Node.js** 18+
- **Express.js**
- **MongoDB / Mongoose**
- **Zod**
- **JWT**
- **Pino**
- **Helmet**
- **Express Rate Limit**
- **Redis** (optional)
- **Multer**

### Deployment & Infrastructure
- **Railway**
- **MongoDB Atlas**
- **Docker**

---

## Project Structure

```text
trainly/
├── android/               # Android app (Kotlin + Compose)
├── backend/               # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── api/           # Routes, controllers, validators, docs endpoints
│   │   ├── core/          # Config, logger, tracing, app errors
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Data access
│   │   ├── infrastructure/# Cache, storage, messaging integrations
│   │   ├── middleware/    # Auth, security, logging, upload, errors
│   │   ├── events/        # Event handlers
│   │   ├── observability/ # Health and metrics helpers
│   │   └── scripts/       # Seed and demo helpers
│   ├── models/            # Mongoose models
│   ├── test/              # Backend tests
│   └── README.md          # Backend runbook
└── docs/
    └── backend/           # Backend architecture and flow docs
```

---

## Backend Architecture

The active backend runtime is:

- `backend/src/server.js` for process bootstrap, configuration, database connection, event registration, and graceful shutdown
- `backend/src/app.js` for Express composition, middleware, docs, health, metrics, and API route mounting

Trainly's backend uses one consistent request flow:

`route -> validator -> controller -> service -> repository/model`

Key backend engineering features:
- centralized config via `backend/src/core/config`
- structured `pino` logging with `x-trace-id`
- centralized app errors and async error handling
- `helmet`, CORS, and rate limiting at the app layer
- Swagger UI, ReDoc, and raw OpenAPI export
- `/api/health` and `/metrics` for operational visibility
- optional Redis-backed cache and token blacklist support
- seed/demo tooling for quick review

---

## Getting Started

### Prerequisites
- **Android Studio** for the mobile app
- **JDK 17**
- **Android SDK** 35
- **Node.js** 18+
- **MongoDB** instance for the backend

### Android App Setup

1. Open `android/` in Android Studio.
2. Build the app:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
3. Run on a device or emulator:
   ```bash
   ./gradlew installDebug
   ```

### Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file:
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

3. Start the API:
   ```bash
   npm start
   ```

4. Seed demo data if you want a populated review environment:
   ```bash
   npm run seed
   ```

5. Run tests:
   ```bash
   npm test
   ```

---

## API and Operational Endpoints

When the backend is running:

- `GET /openapi.json` - raw OpenAPI schema
- `GET /docs` - Swagger UI
- `GET /redoc` - ReDoc
- `GET /api/health` - health, dependency state, memory, and metric snapshot
- `GET /metrics` - Prometheus-style metrics

Authenticated endpoints use the `x-auth-token` header.

---

## Demo and Review Flow

For the fastest backend review:

```bash
cd backend
npm install
npm run seed
npm start
```

Then open:
- `http://localhost:3000/docs`
- `http://localhost:3000/api/health`
- `http://localhost:3000/metrics`

Useful review resources:
- [backend/README.md](/Users/la/Desktop/Repository/horacenjoroge/Trainly/backend/README.md)
- [docs/backend/README.md](/Users/la/Desktop/Repository/horacenjoroge/Trainly/docs/backend/README.md)
- [backend/src/scripts/demo-requests.http](/Users/la/Desktop/Repository/horacenjoroge/Trainly/backend/src/scripts/demo-requests.http:1)
- [docs/backend/demo.md](/Users/la/Desktop/Repository/horacenjoroge/Trainly/docs/backend/demo.md:1)

---

## Backend Documentation

Backend-specific docs live in [docs/backend/README.md](/Users/la/Desktop/Repository/horacenjoroge/Trainly/docs/backend/README.md:1), including:

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

---

## License

This project is licensed under the MIT License.

## Author

**Horace Njoroge**
- GitHub: [@horacenjoroge](https://github.com/horacenjoroge)
- LinkedIn: [Horace Njoroge](https://linkedin.com/in/horacenjoroge)
- Email: horacenjorge@gmail.com
