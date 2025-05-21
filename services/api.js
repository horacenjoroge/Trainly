import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for the API
const API_URL = 'http://192.168.100.88:3000/api';

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
      
      // Attempt to refresh the token
      const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
      
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
      const response = await apiClient.post('/auth/register', userData);
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
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
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
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
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userData');
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
      const response = await apiClient.get('/auth/user');
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

  // Manually refresh token
  refreshToken: async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.log('No refresh token available for manual refresh');
        return false;
      }
      const response = await apiClient.post('/auth/refresh', { refreshToken });
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
  },

  // Get emergency contacts
  getContacts: async () => {
    try {
      console.log('Sending GET /contacts request...');
      const response = await apiClient.get('/contacts');
      console.log('Received response from GET /contacts:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting contacts:', error);
      throw error;
    }
  },

  // Add a new emergency contact
  addContact: async (data) => {
    try {
      console.log('Sending POST /contacts request with data:', data);
      const response = await apiClient.post('/contacts', data);
      console.log('Received response from POST /contacts:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  },

  // Update an existing emergency contact
  updateContact: async (id, data) => {
    try {
      console.log(`Sending PUT /contacts/${id} request with data:`, data);
      const response = await apiClient.put(`/contacts/${id}`, data);
      console.log(`Received response from PUT /contacts/${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  // Delete an emergency contact
  deleteContact: async (id) => {
    try {
      console.log(`Sending DELETE /contacts/${id} request...`);
      const response = await apiClient.delete(`/contacts/${id}`);
      console.log(`Received response from DELETE /contacts/${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  },

  // Send SOS message
  sendSOS: async (data) => {
    try {
      console.log('Sending POST /contacts/send-sos request with data:', data);
      const response = await apiClient.post('/contacts/send-sos', data);
      console.log('Received response from POST /contacts/send-sos:', response);
      return response;
    } catch (error) {
      console.error('Error sending SOS:', error);
      throw error;
    }
  },
};

// Posts services
export const postService = {
  getPosts: async () => {
    try {
      const response = await apiClient.get('/posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },

  createPost: async (postData) => {
    try {
      const response = await apiClient.post('/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  likePost: async (postId) => {
    try {
      const response = await apiClient.put(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  addComment: async (postId, commentData) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  getComments: async (postId) => {
    try {
      const response = await apiClient.get(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },
};

// User services
export const userService = {
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Error loading profile:', error);
      return {};
    }
  },

  updateUserStats: async (statsData) => {
    try {
      const response = await apiClient.put('/users/stats', statsData);
      return response.data;
    } catch (error) {
      console.error('Error updating stats:', error);
      return {};
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
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
      
      const response = await apiClient.post('/users/avatar', formData, {
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

  getUserAchievements: async () => {
    try {
      const response = await apiClient.get('/achievements/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  },

  addAchievement: async (achievementData) => {
    try {
      const response = await apiClient.post('/achievements', achievementData);
      return response.data;
    } catch (error) {
      console.error('Error adding achievement:', error);
      return {};
    }
  },

  getFollowers: async () => {
    try {
      const response = await apiClient.get('/follow/followers');
      return response.data;
    } catch (error) {
      console.error('Error loading followers:', error);
      return [];
    }
  },

  getFollowing: async () => {
    try {
      const response = await apiClient.get('/follow/following');
      return response.data;
    } catch (error) {
      console.error('Error loading following:', error);
      return [];
    }
  },

  followUser: async (userId) => {
    try {
      const response = await apiClient.post(`/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error following user:', error);
      return { success: false };
    }
  },

  unfollowUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return { success: false };
    }
  },

  searchUsers: async (query = '') => {
    try {
      if (query && query.length >= 2) {
        const response = await apiClient.get(`/users/search/${query}`);
        return response.data;
      } else {
        const response = await apiClient.get('/users/search');
        return response.data;
      }
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        _id: userId,
        name: 'User',
        bio: 'Fitness enthusiast',
        avatar: 'https://via.placeholder.com/150',
        stats: {
          workouts: Math.floor(Math.random() * 100),
          hours: Math.floor(Math.random() * 200),
          calories: Math.floor(Math.random() * 50000),
        },
        followers: Math.floor(Math.random() * 30),
        following: Math.floor(Math.random() * 30),
      };
    }
  },
};

export default apiClient;