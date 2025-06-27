# 🏃‍♂️ Trainly - Your Personal Fitness Companion

<div align="center">

![Trainly Logo](assets/images/running-person.png)

[![React Native](https://img.shields.io/badge/React%20Native-0.79.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.0-black.svg)](https://expo.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*Track workouts, connect with friends, and achieve your fitness goals!*

[Download APK](#download) • [Features](#features) • [Screenshots](#screenshots) • [Tech Stack](#tech-stack) • [Setup](#setup)

</div>

---

## 🎯 Overview

**Trainly** is a comprehensive fitness tracking mobile application built with React Native. It combines workout tracking, social features, and progress analytics to create a complete fitness ecosystem for users.

### 🌟 Key Highlights
- **Real-time workout tracking** for multiple activity types
- **Social fitness community** with posts and friend connections
- **Emergency safety features** with SOS functionality
- **Cross-platform** support (Android & iOS ready)
- **Offline-first approach** with cloud synchronization

---

## ✨ Features

### 🏃‍♂️ Workout Tracking
- **Multiple Activity Types**: Running, Cycling, Swimming, Gym workouts
- **GPS Route Tracking**: Real-time location and route mapping
- **Performance Metrics**: Distance, pace, speed, calories, heart rate
- **Workout History**: Detailed analytics and progress tracking

### 👥 Social Features
- **Share Workouts**: Post achievements and progress updates
- **Friend System**: Follow and connect with other fitness enthusiasts
- **Community Feed**: Discover and interact with public workouts
- **Achievement Sharing**: Celebrate milestones together

### 🆘 Safety Features
- **Emergency Contacts**: Quick access to emergency services
- **SOS Functionality**: One-tap emergency alerts
- **Fall Detection**: Automatic emergency response (coming soon)
- **Location Sharing**: Real-time location for safety

### 📊 Analytics & Progress
- **Progress Dashboard**: Visual charts and statistics
- **Achievement System**: Unlock badges and milestones
- **Goal Setting**: Personalized fitness targets
- **Weekly/Monthly Reports**: Comprehensive progress analysis

### 🎨 User Experience
- **Dark/Light Themes**: Customizable interface
- **Orange Brand Theme**: Vibrant and energetic design
- **Responsive Design**: Optimized for all screen sizes
- **Offline Support**: Works without internet connection

---

## 📱 Screenshots

<div align="center">

### Authentication & Dashboard
<img src="https://github.com/user-attachments/assets/abeff81e-2ccd-4ce7-9091-0ddae0375ed6" width="250"> <img src="https://github.com/user-attachments/assets/d24ee21b-4753-4f59-b49c-0fbbcc76b808" width="250">

*Sign In Screen & Home Dashboard*

### Profile & Settings
<img src="https://github.com/user-attachments/assets/91bbd443-63d8-4d3f-b333-15ec00ab999a" width="250"> <img src="https://github.com/user-attachments/assets/247816a7-a3a8-4ddf-9524-e86618ac9746" width="250">

*User Profile & Settings Menu*

### Analytics & Tracking
<img src="https://github.com/user-attachments/assets/f0fefe07-fce7-47aa-9bbf-3fec5c931dcc" width="250"> <img src="https://github.com/user-attachments/assets/b0e0fb9e-9e01-4dd9-95c8-6ee491ee1f02" width="250">

*Progress Statistics & Exercise Selection*

### Emergency Features
<img src="https://github.com/user-attachments/assets/ee9e28b5-aa2a-4caf-9770-b0ea1034502f" width="250">

*Emergency SOS Functionality*

</div>

---

## 🛠️ Tech Stack

### **Frontend (Mobile App)**
- **React Native** 0.79.4 - Cross-platform mobile framework
- **Expo** 53.0.0 - Development platform and build tools
- **React Navigation** - Screen navigation and routing
- **React Native Maps** - GPS tracking and route visualization
- **AsyncStorage** - Local data persistence
- **Axios** - HTTP client for API communication

### **Backend**
- **Node.js** 18+ - Server runtime
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **Multer** - File upload handling

### **Deployment & Infrastructure**
- **Railway** - Backend hosting and deployment
- **MongoDB Atlas** - Database hosting
- **GitHub Pages** - Legal documents hosting
- **Google Play Store** - App distribution

### **Development Tools**
- **ESLint** - Code linting and formatting
- **Metro** - JavaScript bundler for React Native
- **Android Studio** - Android development environment
- **Expo CLI** - Command line tools

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18 or higher
- **npm** or **yarn**
- **Android Studio** (for Android development)
- **Expo CLI** installed globally
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/horacenjoroge/trainly.git
   cd trainly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Add your configuration
   API_URL=your_backend_url
   GOOGLE_MAPS_API_KEY=your_maps_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/emulator**
   ```bash
   # Android
   npm run android
   
   # iOS (requires macOS)
   npm run ios
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

## 📱 Download

<div align="center">

### 🚀 **Get Trainly Now - Ready to Transform Your Fitness Journey!**

<table>
<tr>
<td align="center" width="50%">

### 📱 **Quick Download**
![Trainly QR Code]![qr-code](https://github.com/user-attachments/assets/4b5b7c8e-b869-4597-a071-87c31179bac0)
(https://github.com/user-attachments/assets/qr-code-placeholder.png)

**Scan with your phone camera**  
*Instant access to Trainly APK*

</td>
<td align="center" width="50%">

### 📥 **Direct Download**

**[Download Trainly APK (102MB)](https://drive.google.com/file/d/1MJpB_6pGK1YWRBUoOseVetiPOH1WmMRE/view?usp=sharing)**

*Compatible with Android 7.0+*

**Coming Soon:**
- 🍎 iOS App Store
- 🤖 Google Play Store

</td>
</tr>
</table>

### 📲 **Installation Guide**

1. **📱 Scan QR Code** or **📥 Click Download Link**
2. **⚙️ Enable Installation** - Go to Settings → Security → "Install from Unknown Sources"
3. **📦 Install APK** - Open downloaded file and tap "Install"
4. **🚀 Launch & Enjoy** - Start your fitness journey with Trainly!

*⚠️ Note: APK installation requires enabling "Unknown Sources" in Android settings*

</div>

---

## 🏗️ Project Structure

```
trainly/
├── assets/                 # Images, icons, fonts
├── components/             # Reusable UI components
├── context/               # React Context providers
├── screens/               # Application screens
├── services/              # API services and utilities
├── utils/                 # Helper functions
├── android/               # Android-specific code
├── ios/                   # iOS-specific code (future)
├── backend/               # Server-side code
│   ├── models/            # Database models
│   ├── routes/            # API route handlers
│   ├── middleware/        # Custom middleware
│   └── utils/             # Server utilities
└── docs/                  # Documentation
```

---

## 🔧 Configuration

### App Configuration
Update `app.json` for app-specific settings:
```json
{
  "expo": {
    "name": "Trainly",
    "slug": "trainly",
    "version": "1.0.0",
    "android": {
      "package": "com.trainly.app"
    }
  }
}
```

### API Configuration
Configure API endpoints in `services/api.js`:
```javascript
const API_URL = __DEV__ 
  ? 'http://localhost:3000'
  : 'https://trainly-backend-production.up.railway.app';
```

---

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Manual Testing
1. Test all workout types (Running, Cycling, Swimming, Gym)
2. Verify GPS tracking accuracy
3. Test offline functionality
4. Validate social features
5. Check emergency contact system

---

## 📚 API Documentation

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

[View Full API Documentation](https://trainly-backend-production.up.railway.app/api/docs)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 🐛 Known Issues

- [ ] iOS build configuration pending
- [ ] Apple Health integration in development
- [ ] Offline map caching optimization needed
- [ ] Battery optimization for GPS tracking

---

## 🗺️ Roadmap

### Version 1.1 (Q2 2025)
- [ ] iOS App Store release
- [ ] Apple Health & Google Fit integration
- [ ] Advanced analytics dashboard
- [ ] Workout challenges and competitions

### Version 1.2 (Q3 2025)
- [ ] Nutrition tracking
- [ ] Personal trainer marketplace
- [ ] Video workout guides
- [ ] AI-powered workout recommendations

### Version 2.0 (Q4 2025)
- [ ] Wearable device integration
- [ ] Live workout streaming
- [ ] Virtual reality workouts
- [ ] Advanced biometric tracking

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Horace Njoroge**
- GitHub: [@horacenjoroge](https://github.com/horacenjoroge)
- LinkedIn: [Horace Njoroge](https://linkedin.com/in/horacenjoroge)
- Email: horacenjorge@gmail.com

---

## 🙏 Acknowledgments

- **React Native Community** for the excellent documentation
- **Expo Team** for the amazing development platform
- **MongoDB** for reliable database hosting
- **Railway** for seamless backend deployment


---

## 📞 Support

**Need help or have questions?**

- 📧 **Email**: horacenjorge@gmail.com
- 🐛 **Bug Reports**: [Open an issue](https://github.com/horacenjoroge/trainly/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/horacenjoroge/trainly/discussions)
- 📚 **Documentation**: [Wiki](https://github.com/horacenjoroge/trainly/wiki)

---

<div align="center">

**⭐ If you like Trainly, please give it a star! ⭐**

*Made with ❤️ and lots of ☕ by a fitness enthusiast*

**[📥 Download Now](https://drive.google.com/file/d/1MJpB_6pGK1YWRBUoOseVetiPOH1WmMRE/view?usp=sharing)** | **[🌟 Star on GitHub](https://github.com/horacenjoroge/trainly)**

</div>
