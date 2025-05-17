// context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status on app launch
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        // Check if token is valid (not expired)
        const isTokenValid = checkTokenValidity(token);
        
        if (isTokenValid) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        } else {
          // Token expired, try to refresh
          console.log('Token expired, attempting refresh');
          const refreshed = await authService.refreshToken();
          
          if (refreshed) {
            // Refresh successful
            const updatedUserData = await AsyncStorage.getItem('userData');
            setUser(JSON.parse(updatedUserData));
            setIsAuthenticated(true);
          } else {
            // Refresh failed, user needs to login again
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse JWT to check if token is expired
  const checkTokenValidity = (token) => {
    try {
      // JWT token consists of 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // The middle part is the payload
      const base64Url = parts[1];
      // Convert base64url to base64
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      // Decode base64
      const payload = JSON.parse(atob(base64));
      
      // Check if token has expiration
      if (!payload.exp) return false;
      
      // Compare expiration with current time
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        register,
        refreshAuth: checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);