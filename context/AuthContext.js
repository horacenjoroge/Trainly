// context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authStateVersion, setAuthStateVersion] = useState(0); // Add state version to force updates

  // Debug logging for state changes
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, user: user?.name || 'none' });
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Check authentication status on app launch
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    console.log('Checking auth status...');
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('userData');
      
      console.log('Token exists:', !!token);
      console.log('User data exists:', !!userData);
      
      if (token && userData) {
        // Check if token is valid (not expired)
        const isTokenValid = checkTokenValidity(token);
        console.log('Token valid:', isTokenValid);
        
        if (isTokenValid) {
          try {
            const parsedUserData = JSON.parse(userData);
            // Update state in a single batch to avoid inconsistency
            setUser(parsedUserData);
            setIsAuthenticated(true);
            console.log('Auth state set to authenticated with user:', parsedUserData);
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            await clearAuthData();
          }
        } else {
          // Token expired, try to refresh
          console.log('Token expired, attempting refresh');
          
          try {
            const refreshed = await authService.refreshToken();
            
            if (refreshed) {
              // Refresh successful
              const updatedUserData = await AsyncStorage.getItem('userData');
              const parsedUserData = JSON.parse(updatedUserData);
              setUser(parsedUserData);
              setIsAuthenticated(true);
              console.log('Token refreshed, auth state updated');
            } else {
              // Refresh failed, user needs to login again
              console.log('Token refresh failed, clearing auth state');
              await clearAuthData();
            }
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            await clearAuthData();
          }
        }
      } else {
        console.log('No token or user data found, clearing auth state');
        await clearAuthData();
      }
    } catch (error) {
      console.error('Auth status check error:', error);
      await clearAuthData();
    } finally {
      // Do this after all state updates to ensure consistent reporting
      setTimeout(() => {
        setIsLoading(false);
        console.log('Auth check complete. Authenticated:', isAuthenticated);
      }, 0);
    }
  };

  // Helper to clear auth data
  const clearAuthData = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
    
    // Set state in a single update to avoid inconsistencies
    setUser(null);
    setIsAuthenticated(false);
    setAuthStateVersion(prev => prev + 1);
    console.log('Auth state cleared completely');
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
    if (!credentials) {
      console.error('No credentials provided to login function');
      return { success: false, message: 'No credentials provided' };
    }
    
    console.log('Login attempt with:', credentials.email);
    
    try {
      const data = await authService.login(credentials);
      console.log('Login response received:', { success: !!data, hasUser: !!data.user });
      
      // Store tokens and user data
      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
        console.log('Token stored');
      }
      
      if (data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
        console.log('Refresh token stored');
      }
      
      if (data.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        console.log('User data stored');
      }
      
      // Update state after storage is complete
      setUser(data.user);
      setIsAuthenticated(true);
      setAuthStateVersion(prev => prev + 1);
      
      console.log('Auth state updated after login. Authenticated:', true);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error in context:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    if (!userData) {
      console.error('No user data provided to register function');
      return { success: false, message: 'No user data provided' };
    }
    
    console.log('Registration attempt with:', userData.email);
    
    try {
      const data = await authService.register(userData);
      console.log('Registration response received');
      
      // Store tokens and user data
      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
      }
      
      if (data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
      }
      
      if (data.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      }
      
      // Update state after storage is complete
      setUser(data.user);
      setIsAuthenticated(true);
      setAuthStateVersion(prev => prev + 1);
      
      console.log('Auth state updated after registration');
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    console.log('Logout attempt');
    try {
      await authService.logout();
      console.log('Logout API call successful');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API call fails
    }
    
    // Always clear local data
    await clearAuthData();
    console.log('Logged out, tokens cleared');
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        authStateVersion, // Include this in the context value
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