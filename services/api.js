// services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for the API - note there's no trailing /api
const API_URL = 'http://192.168.100.88:3000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10-second timeout
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
      console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`);
    } catch (error) {
      console.error('Error getting token:', error);
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
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message
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
        // No refresh token, need to re-login
        throw new Error('No refresh token available');
      }
      
      // Attempt to refresh the token
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
      console.error('Error refreshing token:', refreshError);
      
      // Clear tokens and notify app
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userData');
      
      // Process fail queue
      processQueue(refreshError, null);
      
      // We could trigger a global event here to notify the app
      // about authentication failure, but we'll rely on the auth context
      
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
        
        // Store refresh token
        if (response.data.refreshToken) {
          await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
          console.log('Refresh token stored after registration');
        }
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
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
        
        // Store refresh token
        if (response.data.refreshToken) {
          await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
          console.log('Refresh token stored after login');
        }
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Clear stored tokens
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userData');
      
      // Force app reload or navigation if needed
      // Your app may have a global event system or context for this
      // This is just one approach
      if (global.onLogout) {
        global.onLogout();
      }
      
      console.log('Logged out, tokens cleared');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/api/auth/user');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },
  
  // Manually refresh token (can be used for testing)
  refreshToken: async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.log('No refresh token available for manual refresh');
        return false;
      }
      
      const response = await apiClient.post('/api/auth/refresh', { refreshToken });
      
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        
        if (response.data.refreshToken) {
          await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
        }
        
        console.log('Token manually refreshed successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error manually refreshing token:', error);
      return false;
    }
  }
};

// Posts services
export const postService = {
  // Get all posts
  getPosts: async () => {
    try {
      const response = await apiClient.get('/api/posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  // Create a new post
  createPost: async (postData) => {
    try {
      const response = await apiClient.post('/api/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Like or unlike a post
  likePost: async (postId) => {
    try {
      const response = await apiClient.put(`/api/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  // Add comment to a post
  addComment: async (postId, commentData) => {
    try {
      const response = await apiClient.post(`/api/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Get comments for a post
  getComments: async (postId) => {
    try {
      const response = await apiClient.get(`/api/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }
};

// User services
export const userService = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/api/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error loading profile:', error);
      return {};
    }
  },

  // Update user stats
  updateUserStats: async (statsData) => {
    try {
      const response = await apiClient.put('/api/users/stats', statsData);
      return response.data;
    } catch (error) {
      console.error('Error updating stats:', error);
      return {};
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/api/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return {};
    }
  },
  
  // Upload profile image
  uploadProfileImage: async (imageUri) => {
    try {
      // Create form data for image upload
      const formData = new FormData();
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type
      });
      
      const response = await apiClient.post('/api/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      return {};
    }
  },
  
  // Get user achievements - Updated path to match your backend
  getUserAchievements: async () => {
    try {
      // Changed from /api/users/achievements to /api/achievements/user
      const response = await apiClient.get('/api/achievements/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  },
  
  // Add new achievement - Updated path to match your backend
  addAchievement: async (achievementData) => {
    try {
      // Changed from /api/users/achievements to /api/achievements
      const response = await apiClient.post('/api/achievements', achievementData);
      return response.data;
    } catch (error) {
      console.error('Error adding achievement:', error);
      return {};
    }
  },
  
  // Get user followers - Updated path to match your backend
  getFollowers: async () => {
    try {
      // Changed from /api/users/followers to /api/follow/followers
      const response = await apiClient.get('/api/follow/followers');
      return response.data;
    } catch (error) {
      console.error('Error loading followers:', error);
      return [];
    }
  },
  
  // Get user following - Updated path to match your backend
  getFollowing: async () => {
    try {
      // Changed from /api/users/following to /api/follow/following
      const response = await apiClient.get('/api/follow/following');
      return response.data;
    } catch (error) {
      console.error('Error loading following:', error);
      return [];
    }
  },
  
  // Follow a user - Updated path to match your backend
  followUser: async (userId) => {
    try {
      // Changed from /api/users/follow/:id to /api/follow/:id
      const response = await apiClient.post(`/api/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error following user:', error);
      return { success: false };
    }
  },
  
  // Unfollow a user - Updated path to match your backend
  unfollowUser: async (userId) => {
    try {
      // Changed from /api/users/follow/:id to /api/follow/:id
      const response = await apiClient.delete(`/api/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return { success: false };
    }
  },
  
   // New method to search users
   searchUsers: async (query = '') => {
    try {
      // If there's a search query, use the query-based endpoint
      if (query && query.length >= 2) {
        const response = await apiClient.get(`/api/users/search/${query}`);
        return response.data;
      } 
      // Otherwise, fetch all users
      else {
        const response = await apiClient.get('/api/users/search');
        return response.data;
      }
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },
  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Return mock data on error
      return {
        _id: userId,
        name: 'User',
        bio: 'Fitness enthusiast',
        avatar: 'https://via.placeholder.com/150',
        stats: {
          workouts: Math.floor(Math.random() * 100),
          hours: Math.floor(Math.random() * 200),
          calories: Math.floor(Math.random() * 50000)
        },
        followers: Math.floor(Math.random() * 30),
        following: Math.floor(Math.random() * 30)
      };
    }
  }
};

export default apiClient;