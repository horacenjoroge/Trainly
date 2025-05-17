// App.js - Update without using react-native-base64
import './global.js'; // This must be the first import
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './context/ThemeContext';
import SplashScreenComponent from './screens/SplashScreen';
import MainComponent from './screens/MainComponent';
import AuthScreen from './screens/AuthScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './theme.js';

// Add a safer image helper for your whole app
global.getSafeImageUri = (uri) => {
  if (uri === null || uri === undefined) return '';
  return String(uri);
};

// Add global handler for logout
global.onLogout = null;

const RootStack = createStackNavigator();

// Create wrapper components instead of inline functions
const MainComponentWrapper = ({ navigation, route }) => {
  const { onLogout } = route.params || {};
  return <MainComponent navigation={navigation} onLogout={onLogout} />;
};

const AuthScreenWrapper = ({ navigation, route }) => {
  const { onAuthSuccess } = route.params || {};
  return <AuthScreen navigation={navigation} onAuthSuccess={onAuthSuccess} />;
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    const initialize = async () => {
      // Show splash screen for at least 2 seconds
      const minSplashTime = new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        // Check auth status
        await checkAuthStatus();
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      }
      
      // Wait for minimum splash time to complete
      await minSplashTime;
      
      // Hide splash screen
      setIsLoading(false);
    };
    
    initialize();
    
    // Set up global logout handler
    global.onLogout = () => {
      console.log('Global logout handler triggered in App.js');
      setIsAuthenticated(false);
    };
    
    // Cleanup
    return () => {
      global.onLogout = null;
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token check on app start:', token ? 'Found token' : 'No token found');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Failed to get authentication token', error);
      setIsAuthenticated(false);
    }
  };

  // Handler for when authentication is successful
  const handleAuthSuccess = async () => {
    console.log('Auth success callback triggered');
    setIsAuthenticated(true);
  };
  
  // Handler for logout passed to MainComponent
  const handleLogout = () => {
    console.log('Logout handler in App.js triggered');
    setIsAuthenticated(false);
  };

  // Show splash screen while checking authentication
  if (isLoading) {
    return (
      <ThemeProvider>
        <SplashScreenComponent />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <NavigationContainer theme={theme}>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            // User is signed in
            <RootStack.Screen 
              name="MainApp" 
              component={MainComponentWrapper}
              initialParams={{ onLogout: handleLogout }}
            />
          ) : (
            // User is not signed in
            <RootStack.Screen 
              name="Auth" 
              component={AuthScreenWrapper}
              initialParams={{ onAuthSuccess: handleAuthSuccess }}
            />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}