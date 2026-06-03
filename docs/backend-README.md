# Training-Backend

A RESTful fitness tracker backend API built with Node.js, Express, and MongoDB. Powers a social fitness app with workout tracking, GPS route logging, achievements/gamification, social feed, and emergency SOS alerts via Twilio.

## Features

- **Authentication** — JWT-based registration/login with access + refresh token rotation
- **User Profiles** — Customizable profiles with stats, bio, avatars, and follower system
- **Workout Tracking** — Multi-sport logging (running, cycling, swimming, gym, walking, hiking) with GPS routes, heart rate zones, splits, intervals, and exercise sets
- **Social Feed** — Posts with images, likes, and comments; public workout discovery
- **Achievements & Gamification** — Template-driven achievement system with rarity tiers (common, rare, epic, legendary), leaderboards, and progress tracking
- **Emergency Contacts & SOS** — Store emergency contacts and trigger SMS alerts via Twilio with location sharing
- **File Uploads** — Avatar and post image uploads with Multer
- **Health & Debug** — Health check endpoint and inline API docs in development mode

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express 4 |
| Database | MongoDB + Mongoose 8 |
| Auth | JSON Web Tokens |
| SMS | Twilio |
| Uploads | Multer |
| Templates | Pug (minimal) |

## Getting Started

### Prerequisites

- Node.js (LTS)
- MongoDB instance (Atlas recommended)
- npm

### Installation

```bash
cd TrainingApp
npm install
```

### Environment Variables

Create a `.env` file in `TrainingApp/`:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for signing JWT access tokens |
| `REFRESH_TOKEN_SECRET` | Yes | Secret for signing refresh tokens |
| `TWILIO_ACCOUNT_SID` | For SOS | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | For SOS | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | For SOS | Twilio SMS sender number |
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | `development` or `production` |

### Run

```bash
npm start
```

Server starts on `http://localhost:3000`.

## Project Structure

```
TrainingApp/
├── app.js                    # Express app setup and middleware
├── bin/www                   # HTTP server entry point
├── controllers/              # Route handlers (auth, user, post, workout, achievement, follow, contacts, upload)
├── middleware/               # JWT auth guard and input validation
├── models/                   # Mongoose schemas (user, post, workout, Achievement, contact, Follower)
├── routes/                   # Express route definitions
├── utils/                    # Multer upload configuration
├── public/uploads/           # Uploaded files (avatars, posts, workouts)
└── views/                    # Pug templates
```

## API Overview

Base path: `/api`

| Endpoint | Description |
|----------|-------------|
| `POST /auth/register` | Register a new user |
| `POST /auth/login` | Login, receive JWT tokens |
| `GET /auth/user` | Get current user |
| `POST /auth/refresh` | Refresh access token |
| `POST /auth/logout` | Logout |
| `GET /users/profile` | Get own profile with stats |
| `PUT /users/profile` | Update name/bio |
| `PUT /users/stats` | Update workout stats |
| `POST /users/avatar` | Upload avatar image |
| `GET /users/search` | Find / search users |
| `POST /users/follow/:userId` | Follow a user |
| `DELETE /users/follow/:userId` | Unfollow a user |
| `GET /posts` | Get social feed posts (paginated) |
| `POST /posts` | Create a post |
| `PUT /posts/:id/like` | Like/unlike a post |
| `POST /posts/:id/comments` | Comment on a post |
| `GET /workouts` | Get own workouts (filtered, paginated) |
| `POST /workouts` | Create a workout |
| `GET /workouts/stats/summary` | Workout statistics by period |
| `GET /workouts/public/feed` | Public workout discovery feed |
| `GET /achievements` | Get user achievements |
| `GET /achievements/leaderboard` | Global points leaderboard |
| `GET /achievements/templates` | Available achievement definitions |
| `GET /contacts` | Get emergency contacts |
| `POST /contacts` | Add emergency contact |
| `POST /contacts/send-sos` | Send SOS SMS to all contacts |
| `GET /health` | Health check (DB + routes) |

## Utility Scripts

```bash
node check-env.js              # Verify environment variables
node test-mongo-connection.js  # Test MongoDB connectivity
node fix-images.js             # Migrate/fix image paths in DB
```

## Deployment

Configured for Railway deployment. Set the required environment variables in your Railway project and deploy.

## License

Private — internal project.
