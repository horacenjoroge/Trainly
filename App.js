import './global.js'; // This must be the first import
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import SplashScreenComponent from './screens/SplashScreen';
import MainComponent from './screens/MainComponent';
import AuthScreen from './screens/AuthScreen';
import { theme } from './theme.js';

// Add a safer image helper for your whole app
global.getSafeImageUri = (uri) => {
  if (uri === null || uri === undefined) return '';
  return String(uri);
};

// Add global handler for logout that will be set in the AppContent component
global.onLogout = null;

const RootStack = createStackNavigator();

// Create wrapper components
const MainComponentWrapper = ({ navigation }) => {
  const { logout, isAuthenticated } = useAuth();
  
  // Handler for logout
  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logout successful from MainComponentWrapper');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return <MainComponent navigation={navigation} onLogout={handleLogout} />;
};

const AuthScreenWrapper = ({ navigation }) => {
  const { login, register, isAuthenticated } = useAuth();
  
  // Enhanced login handler with safe navigation
  const enhancedLogin = async (credentials) => {
    console.log('Enhanced login handler called with:', credentials);
    
    // Validate credentials
    if (!credentials || !credentials.email || !credentials.password) {
      console.error('Invalid credentials format:', credentials);
      return { success: false, message: 'Invalid email or password format' };
    }
    
    try {
      const result = await login(credentials);
      console.log('Login result:', result);
      
      if (result && result.success) {
        console.log('Login successful, navigation should handle screen change');
      }
      
      return result;
    } catch (error) {
      console.error('Login error in wrapper:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };
  
  // Enhanced register handler with safe navigation
  const enhancedRegister = async (userData) => {
    console.log('Enhanced register handler called with:', userData);
    
    // Validate user data
    if (!userData || !userData.email || !userData.password || !userData.name) {
      console.error('Invalid registration data format:', userData);
      return { success: false, message: 'Please provide all required fields' };
    }
    
    try {
      const result = await register(userData);
      console.log('Registration result:', result);
      
      if (result && result.success) {
        console.log('Registration successful, navigation should handle screen change');
      }
      
      return result;
    } catch (error) {
      console.error('Registration error in wrapper:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };
  
  // Authentication success handler
  const handleAuthSuccess = (userData) => {
    console.log('Authentication successful:', userData);
  };

  return (
    <AuthScreen 
      navigation={navigation} 
      onLogin={enhancedLogin} 
      onRegister={enhancedRegister}
      onAuthSuccess={handleAuthSuccess}
    />
  );
};

// App content component that uses auth context
const AppContent = () => {
  const { isAuthenticated, isLoading, refreshAuth, authStateVersion } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  
  console.log('AppContent render - Auth state:', { isAuthenticated, isLoading, authStateVersion });

  // Show splash screen for at least 2 seconds
  useEffect(() => {
    const minSplashTime = new Promise(resolve => setTimeout(resolve, 2000));
    minSplashTime.then(() => setShowSplash(false));
  }, []);

  // Set up global logout handler
  useEffect(() => {
    global.onLogout = async () => {
      console.log('Global logout handler triggered');
      await refreshAuth(); // Refresh authentication state
    };
    
    return () => {
      global.onLogout = null;
    };
  }, [refreshAuth]);

  // Show splash screen while authentication is being checked or delay is active
  if (isLoading || showSplash) {
    return <SplashScreenComponent />;
  }

  // Log navigation state decision
  console.log('Navigation state decision:', isAuthenticated ? 'MainApp' : 'Auth');

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer theme={theme}>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            // User is signed in
            <RootStack.Screen 
              name="MainApp" 
              component={MainComponentWrapper}
              // Force remount when auth state changes
              key={`main-${authStateVersion || 0}`}
            />
          ) : (
            // User is not signed in
            <RootStack.Screen 
              name="Auth" 
              component={AuthScreenWrapper}
              // Force remount when auth state changes
              key={`auth-${authStateVersion || 0}`}
            />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
};

// Main App component
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}