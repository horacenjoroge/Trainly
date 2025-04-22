// App.js
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

const RootStack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth status on mount and when token changes
  useEffect(() => {
    checkAuthStatus();

    // Set up a listener for auth state changes
    const authCheckInterval = setInterval(() => {
      checkAuthStatus();
    }, 1000); // Check every second

    return () => {
      clearInterval(authCheckInterval);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Failed to get authentication token', error);
    } finally {
      setIsLoading(false);
    }
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
            <RootStack.Screen name="MainApp" component={MainComponent} />
          ) : (
            // User is not signed in
            <RootStack.Screen 
              name="Auth" 
              component={(props) => (
                <AuthScreen {...props} onAuthSuccess={checkAuthStatus} />
              )} 
            />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}