// services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.100.88:3000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userData');
    return true;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/user');
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  }
};

// Posts services
export const postService = {
  // Get all posts
  getPosts: async () => {
    const response = await apiClient.get('/api/posts');
    return response.data;
  },

  // Create a new post
  createPost: async (postData) => {
    const response = await apiClient.post('/api/posts', postData);
    return response.data;
  },

  // Like or unlike a post
  likePost: async (postId) => {
    const response = await apiClient.put(`/api/posts/${postId}/like`);
    return response.data;
  },

  // Add comment to a post
  addComment: async (postId, commentData) => {
    const response = await apiClient.post(`/api/posts/${postId}/comments`, commentData);
    return response.data;
  },

  // Get comments for a post
  getComments: async (postId) => {
    const response = await apiClient.get(`/api/posts/${postId}/comments`);
    return response.data;
  }
};

// User services
export const userService = {
  // Get user profile
  getUserProfile: async () => {
    const response = await apiClient.get('/api/users/profile');
    return response.data;
  },

  // Update user stats
  updateUserStats: async (statsData) => {
    const response = await apiClient.put('/api/users/stats', statsData);
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    const response = await apiClient.put('/api/users/profile', profileData);
    return response.data;
  },
  
  // Upload profile image
  uploadProfileImage: async (imageUri) => {
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
  },
  
  // Get user achievements
  getUserAchievements: async () => {
    const response = await apiClient.get('/api/users/achievements');
    return response.data;
  },
  
  // Add new achievement
  addAchievement: async (achievementData) => {
    const response = await apiClient.post('/api/users/achievements', achievementData);
    return response.data;
  },
  
  // Get user followers
  getFollowers: async () => {
    const response = await apiClient.get('/api/users/followers');
    return response.data;
  },
  
  // Get user following
  getFollowing: async () => {
    const response = await apiClient.get('/api/users/following');
    return response.data;
  },
  
  // Follow a user
  followUser: async (userId) => {
    const response = await apiClient.post(`/api/users/follow/${userId}`);
    return response.data;
  },
  
  // Unfollow a user
  unfollowUser: async (userId) => {
    const response = await apiClient.delete(`/api/users/follow/${userId}`);
    return response.data;
  }
};

export default apiClient;