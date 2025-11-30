import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { log, logError } from '../utils/logger';

// Base URL for the API
const API_URL = 'https://trainingapp-api-production.up.railway.app';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10-second timeout
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add token to requests if it exists
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers['x-auth-token'] = token;
      }
      // Log requests for debugging
      log(`Request: ${config.method?.toUpperCase()} ${config.url}`);
    } catch (error) {
      logError('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is not 401 or it's already been retried, reject
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      logError('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
      });
      return Promise.reject(error);
    }
    
    // If we're already refreshing, add to queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers['x-auth-token'] = token;
          return apiClient(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      // Get the refresh token
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      // Attempt to refresh the token - FIXED: Added /api
      const response = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken });
      
      if (response.data.token) {
        // Store the new tokens
        await AsyncStorage.setItem('token', response.data.token);
        if (response.data.refreshToken) {
          await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
        }
        
        // Update header for future requests
        apiClient.defaults.headers.common['x-auth-token'] = response.data.token;
        
        // Update original request and retry
        originalRequest.headers['x-auth-token'] = response.data.token;
        
        // Process any queued requests
        processQueue(null, response.data.token);
        
        return apiClient(originalRequest);
      } else {
        throw new Error('Refresh token request did not return a new token');
      }
    } catch (refreshError) {
      logError('Error refreshing token:', refreshError);
      
      // Clear tokens and notify app
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userData');
      
      // Process fail queue
      processQueue(refreshError, null);
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// Re-export services for backward compatibility
// Services are now in separate files for better organization
export { authService } from './authService';
export { postService } from './postService';
export { userService } from './userService';


export default apiClient;