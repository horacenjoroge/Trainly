import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { log, logError } from '../utils/logger';

// Base URL for the API
const API_URL = __DEV__ 
  ? 'http://192.168.100.88:3000'  // Local development
  : 'https://trainly-backend-production.up.railway.app';  // Production

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

// Auth services
export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await apiClient.post('/api/auth/register', userData);
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        if (response.data.refreshToken) {
          await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
          log('Refresh token stored after registration');
        }
      }
      return response.data;
    } catch (error) {
      logError('Registration error:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/api/auth/login', credentials);
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        if (response.data.refreshToken) {
          await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
          log('Refresh token stored after login');
        }
      }
      return response.data;
    } catch (error) {
      logError('Login error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userData');
      // Logout handled by AuthContext - no need for global callback
      log('Logged out, tokens cleared');
      return true;
    } catch (error) {
      logError('Logout error:', error);
      return false;
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/api/auth/user');
      return response.data;
    } catch (error) {
      logError('Error getting current user:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },

  // Manually refresh token
  refreshToken: async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        log('No refresh token available for manual refresh');
        return false;
      }
      const response = await apiClient.post('/api/auth/refresh', { refreshToken });
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        if (response.data.refreshToken) {
          await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
        }
        log('Token manually refreshed successfully');
        return true;
      }
      return false;
    } catch (error) {
      logError('Error manually refreshing token:', error);
      return false;
    }
  },

  // Get emergency contacts
  getContacts: async () => {
    try {
      log('Sending GET /api/contacts request...');
      const response = await apiClient.get('/api/contacts');
      log('Received response from GET /api/contacts:', response.data);
      return response.data;
    } catch (error) {
      logError('Error getting contacts:', error);
      throw error;
    }
  },

  // Add a new emergency contact
  addContact: async (data) => {
    try {
      log('Sending POST /api/contacts request with data:', data);
      const response = await apiClient.post('/api/contacts', data);
      log('Received response from POST /api/contacts:', response.data);
      return response.data;
    } catch (error) {
      logError('Error adding contact:', error);
      throw error;
    }
  },

  // Update an existing emergency contact
  updateContact: async (id, data) => {
    try {
      log(`Sending PUT /api/contacts/${id} request with data:`, data);
      const response = await apiClient.put(`/api/contacts/${id}`, data);
      log(`Received response from PUT /api/contacts/${id}:`, response.data);
      return response.data;
    } catch (error) {
      logError('Error updating contact:', error);
      throw error;
    }
  },

  // Delete an emergency contact
  deleteContact: async (id) => {
    try {
      log(`Sending DELETE /api/contacts/${id} request...`);
      const response = await apiClient.delete(`/api/contacts/${id}`);
      log(`Received response from DELETE /api/contacts/${id}:`, response.data);
      return response.data;
    } catch (error) {
      logError('Error deleting contact:', error);
      throw error;
    }
  },

  // Send SOS message
  sendSOS: async (data) => {
    try {
      log('Sending POST /api/contacts/send-sos request with data:', data);
      const response = await apiClient.post('/api/contacts/send-sos', data);
      log('Received response from POST /api/contacts/send-sos:', response);
      return response;
    } catch (error) {
      logError('Error sending SOS:', error);
      throw error;
    }
  },
};

// Posts services
export const postService = {
  getPosts: async () => {
    try {
      const response = await apiClient.get('/api/posts');
      return response.data;
    } catch (error) {
      logError('Error fetching posts:', error);
      return [];
    }
  },

  createPost: async (postData) => {
    try {
      const response = await apiClient.post('/api/posts', postData);
      return response.data;
    } catch (error) {
      logError('Error creating post:', error);
      throw error;
    }
  },

  likePost: async (postId) => {
    try {
      const response = await apiClient.put(`/api/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      logError('Error liking post:', error);
      throw error;
    }
  },

  addComment: async (postId, commentData) => {
    try {
      const response = await apiClient.post(`/api/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      logError('Error adding comment:', error);
      throw error;
    }
  },

  getComments: async (postId) => {
    try {
      const response = await apiClient.get(`/api/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      logError('Error fetching comments:', error);
      return [];
    }
  },
};

// User services
export const userService = {
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/api/users/profile');
      return response.data;
    } catch (error) {
      logError('Error loading profile:', error);
      return {};
    }
  },

  updateUserStats: async (statsData) => {
    try {
      const response = await apiClient.put('/api/users/stats', statsData);
      return response.data;
    } catch (error) {
      logError('Error updating stats:', error);
      return {};
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/api/users/profile', profileData);
      return response.data;
    } catch (error) {
      logError('Error updating profile:', error);
      return {};
    }
  },

  uploadProfileImage: async (imageUri) => {
    try {
      const formData = new FormData();
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type,
      });
      
      const response = await apiClient.post('/api/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      logError('Error uploading image:', error);
      return {};
    }
  },

  getUserAchievements: async () => {
    try {
      const response = await apiClient.get('/api/achievements/user');
      return response.data;
    } catch (error) {
      logError('Error fetching achievements:', error);
      return [];
    }
  },

  addAchievement: async (achievementData) => {
    try {
      const response = await apiClient.post('/api/achievements', achievementData);
      return response.data;
    } catch (error) {
      logError('Error adding achievement:', error);
      return {};
    }
  },

  getFollowers: async (userId) => {
    try {
      const response = await apiClient.get(`/api/follow/followers${userId ? `?userId=${userId}` : ''}`);
      return response.data;
    } catch (error) {
      logError('Error loading followers:', error);
      return [];
    }
  },
  
  getFollowing: async (userId) => {
    try {
      const response = await apiClient.get(`/api/follow/following${userId ? `?userId=${userId}` : ''}`);
      return response.data;
    } catch (error) {
      logError('Error loading following:', error);
      return [];
    }
  },

  followUser: async (userId) => {
    try {
      const response = await apiClient.post(`/api/follow/${userId}`);
      return response.data;
    } catch (error) {
      logError('Error following user:', error);
      return { success: false };
    }
  },

  unfollowUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/api/follow/${userId}`);
      return response.data;
    } catch (error) {
      logError('Error unfollowing user:', error);
      return { success: false };
    }
  },

  searchUsers: async (query = '') => {
    try {
      if (query && query.length >= 2) {
        const response = await apiClient.get(`/api/users/search/${query}`);
        return response.data;
      } else {
        const response = await apiClient.get('/api/users/search');
        return response.data;
      }
    } catch (error) {
      logError('Error searching users:', error);
      return [];
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      logError('Error fetching user profile:', error);
      // Return null instead of fake data to indicate error
      // Caller should handle null case and show appropriate error message
      return null;
    }
  },
};

export default apiClient;