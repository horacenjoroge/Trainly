import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

// Theme storage key
const THEME_PREFERENCE_KEY = '@trainly_theme_mode';

// Define dark colors - modernized palette
const darkColors = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#2C2C2C',
  primary: '#FF7D2C', // Vibrant orange
  primaryLight: '#FF9F5C',
  primaryDark: '#E56200',
  secondary: '#4ECDC4', // Teal accent
  card: '#252525',
  success: '#5CB85C',
  error: '#FF5252',
  warning: '#FFC107'
};

// Define light colors - modernized palette
const lightColors = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#212529',
  textSecondary: '#6C757D',
  border: '#E9ECEF',
  primary: '#FF7D2C', // Vibrant orange
  primaryLight: '#FF9F5C',
  primaryDark: '#E56200',
  secondary: '#4ECDC4', // Teal accent
  card: '#FFFFFF',
  success: '#5CB85C',
  error: '#FF5252',
  warning: '#FFC107'
};

// Create the theme context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme preference from storage on initial mount
  useEffect(() => {
    async function loadThemePreference() {
      try {
        // Get stored theme preference
        const savedPreference = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        
        if (savedPreference) {
          // Use saved preference
          setIsDarkMode(savedPreference === 'dark');
        } else {
          // Use device preference if no saved preference
          const deviceColorScheme = Appearance.getColorScheme();
          setIsDarkMode(deviceColorScheme === 'dark');
          
          // Save the initial preference
          await AsyncStorage.setItem(THEME_PREFERENCE_KEY, deviceColorScheme || 'light');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
        // Default to system preference
        const deviceColorScheme = Appearance.getColorScheme();
        setIsDarkMode(deviceColorScheme === 'dark');
      } finally {
        setIsLoading(false);
      }
    }

    loadThemePreference();
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // Check if we're using the system preference
      AsyncStorage.getItem(THEME_PREFERENCE_KEY).then(savedPreference => {
        if (savedPreference === 'system' || !savedPreference) {
          setIsDarkMode(colorScheme === 'dark');
        }
      }).catch(error => {
        console.error('Error checking saved theme preference:', error);
      });
    });

    // Cleanup listener on unmount
    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
    };
  }, []);

  // Toggle theme function
  const toggleDarkMode = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      
      // Save preference
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Set system theme function
  const useSystemTheme = async () => {
    try {
      const deviceColorScheme = Appearance.getColorScheme();
      setIsDarkMode(deviceColorScheme === 'dark');
      
      // Save that we're using system preference
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, 'system');
    } catch (error) {
      console.error('Error setting system theme:', error);
    }
  };

  // Get current theme colors
  const colors = isDarkMode ? darkColors : lightColors;

  // Create navigation theme for React Navigation
  const navigationTheme = {
    dark: isDarkMode,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };

  // Define spacing constants for consistent UI
  const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  };

  // Define border radius constants
  const borderRadius = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 28,
    circle: 9999,
  };

  // Create theme object
  const theme = {
    isDarkMode,
    colors,
    toggleDarkMode,
    useSystemTheme,
    isLoading,
    navigationTheme,
    spacing,
    borderRadius
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};