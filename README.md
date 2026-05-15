# Trainly - Your Personal Fitness Companion

<div align="center">

[![Kotlin](https://img.shields.io/badge/Kotlin-2.0.21-purple.svg)](https://kotlinlang.org/)
[![Jetpack Compose](https://img.shields.io/badge/Compose-BOM%202024.12.01-green.svg)](https://developer.android.com/jetpack/compose)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*Track workouts, connect with friends, and achieve your fitness goals!*

</div>

---

## Overview

**Trainly** is a comprehensive fitness tracking Android application built with Kotlin and Jetpack Compose. It combines workout tracking, social features, and progress analytics to create a complete fitness ecosystem for users.

### Key Highlights
- **Real-time workout tracking** for multiple activity types
- **Social fitness community** with posts and friend connections
- **Emergency safety features** with SOS functionality
- **Offline-first approach** with Room local database and cloud synchronization
- **Material 3 Design** with dark/light theme support

---

## Features

### Workout Tracking
- **Multiple Activity Types**: Running, Cycling, Swimming, Gym workouts
- **GPS Route Tracking**: Real-time location and route mapping
- **Performance Metrics**: Distance, pace, speed, calories
- **Workout History**: Detailed analytics and progress tracking

### Social Features
- **Share Workouts**: Post achievements and progress updates
- **Friend System**: Follow and connect with other fitness enthusiasts
- **Community Feed**: Discover and interact with public workouts
- **Achievement Sharing**: Celebrate milestones together

### Safety Features
- **Emergency Contacts**: Quick access to emergency services
- **SOS Functionality**: One-tap emergency alerts
- **Location Sharing**: Real-time location for safety

### Analytics & Progress
- **Progress Dashboard**: Visual charts and statistics
- **Achievement System**: Unlock badges and milestones
- **Goal Setting**: Personalized fitness targets
- **Weekly/Monthly Reports**: Comprehensive progress analysis

---

## Tech Stack

### Frontend (Android App)
- **Kotlin** 100% - Modern programming language
- **Jetpack Compose** - Declarative UI framework
- **Material 3** - Design system
- **Navigation Compose** - Screen navigation and routing
- **Hilt** - Dependency injection
- **Retrofit** - HTTP client for API communication
- **Room** - Local database
- **Coil** - Image loading
- **Google Maps** - GPS tracking and route visualization
- **DataStore** - Preferences storage
- **Paging 3** - Paginated data loading

### Backend
- **Node.js** 18+ - Server runtime
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **Multer** - File upload handling

### Deployment & Infrastructure
- **Railway** - Backend hosting and deployment
- **MongoDB Atlas** - Database hosting
- **Google Play Store** - App distribution

---

## Project Structure

```
trainly/
├── android/               # Android app (Kotlin + Compose)
│   ├── app/
│   │   └── src/main/java/com/trainly/app/
│   │       ├── data/           # Data layer (remote, local, repository)
│   │       ├── di/             # Hilt dependency injection modules
│   │       ├── domain/         # Domain models and repository interfaces
│   │       ├── ui/             # UI layer (screens, components, navigation, theme)
│   │       ├── viewmodel/      # ViewModels
│   │       └── utils/          # Utility functions
│   ├── build.gradle            # Root build file
│   └── settings.gradle         # Gradle settings
├── backend/               # Server-side code (Node.js + Express)
│   ├── models/            # Database models
│   ├── routes/            # API route handlers
│   ├── middleware/        # Custom middleware
│   └── utils/             # Server utilities
└── docs/                  # Documentation
```

---

## Getting Started

### Prerequisites
- **Android Studio** (latest stable)
- **JDK 17**
- **Android SDK** 35
- **Node.js** 18 or higher (for backend)

### Android App Setup

1. **Open the project in Android Studio**
   ```bash
   open android/   # or open in Android Studio
   ```

2. **Build the project**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

3. **Run on device/emulator**
   ```bash
   ./gradlew installDebug
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   # Create .env file
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_secret
   PORT=3000
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

---

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh

### Workout Endpoints
- `GET /api/workouts` - Get user workouts
- `POST /api/workouts` - Create new workout
- `GET /api/workouts/stats` - Get workout statistics

### Social Endpoints
- `GET /api/posts` - Get social feed
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like/unlike post

---

## License

This project is licensed under the MIT License.

## Author

**Horace Njoroge**
- GitHub: [@horacenjoroge](https://github.com/horacenjoroge)
- LinkedIn: [Horace Njoroge](https://linkedin.com/in/horacenjoroge)
- Email: horacenjorge@gmail.com
