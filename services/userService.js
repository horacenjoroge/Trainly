// services/userService.js
import apiClient from './api';
import { logError } from '../utils/logger';
import { handleApiError } from '../utils/errorHandler';
import { createFormData } from '../utils/apiHelpers';

/**
 * User service
 * Handles user profiles, achievements, following, and search
 */
export const userService = {
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/api/users/profile');
      return response.data;
    } catch (error) {
      logError('Error loading profile:', error);
      // Return empty object instead of throwing for profile display
      return {};
    }
  },

  /**
   * Update user statistics
   * @param {Object} statsData - Statistics data
   * @returns {Promise<Object>} Updated stats
   */
  updateUserStats: async (statsData) => {
    try {
      const response = await apiClient.put('/api/users/stats', statsData);
      return response.data;
    } catch (error) {
      logError('Error updating stats:', error);
      throw handleApiError(error, 'Failed to update statistics');
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data
   * @returns {Promise<Object>} Updated profile
   */
  updateUserProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/api/users/profile', profileData);
      return response.data;
    } catch (error) {
      logError('Error updating profile:', error);
      throw handleApiError(error, 'Failed to update profile');
    }
  },

  /**
   * Upload profile image
   * @param {string} imageUri - Image URI
   * @returns {Promise<Object>} Upload response with image URL
   */
  uploadProfileImage: async (imageUri) => {
    try {
      const formData = createFormData({}, { image: imageUri });
      
      const response = await apiClient.post('/api/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      logError('Error uploading image:', error);
      throw handleApiError(error, 'Failed to upload profile image');
    }
  },

  /**
   * Get user achievements
   * @returns {Promise<Array>} List of achievements
   */
  getUserAchievements: async () => {
    try {
      const response = await apiClient.get('/api/achievements/user');
      return response.data;
    } catch (error) {
      logError('Error fetching achievements:', error);
      return [];
    }
  },

  /**
   * Add an achievement
   * @param {Object} achievementData - Achievement data
   * @returns {Promise<Object>} Created achievement
   */
  addAchievement: async (achievementData) => {
    try {
      const response = await apiClient.post('/api/achievements', achievementData);
      return response.data;
    } catch (error) {
      logError('Error adding achievement:', error);
      throw handleApiError(error, 'Failed to add achievement');
    }
  },

  /**
   * Get followers list
   * @param {string} [userId] - Optional user ID (defaults to current user)
   * @returns {Promise<Array>} List of followers
   */
  getFollowers: async (userId) => {
    try {
      const query = userId ? `?userId=${userId}` : '';
      const response = await apiClient.get(`/api/follow/followers${query}`);
      return response.data;
    } catch (error) {
      logError('Error loading followers:', error);
      return [];
    }
  },
  
  /**
   * Get following list
   * @param {string} [userId] - Optional user ID (defaults to current user)
   * @returns {Promise<Array>} List of users being followed
   */
  getFollowing: async (userId) => {
    try {
      const query = userId ? `?userId=${userId}` : '';
      const response = await apiClient.get(`/api/follow/following${query}`);
      return response.data;
    } catch (error) {
      logError('Error loading following:', error);
      return [];
    }
  },

  /**
   * Follow a user
   * @param {string} userId - User ID to follow
   * @returns {Promise<Object>} Follow result
   */
  followUser: async (userId) => {
    try {
      const response = await apiClient.post(`/api/follow/${userId}`);
      return response.data;
    } catch (error) {
      logError('Error following user:', error);
      return { success: false, ...handleApiError(error, 'Failed to follow user') };
    }
  },

  /**
   * Unfollow a user
   * @param {string} userId - User ID to unfollow
   * @returns {Promise<Object>} Unfollow result
   */
  unfollowUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/api/follow/${userId}`);
      return response.data;
    } catch (error) {
      logError('Error unfollowing user:', error);
      return { success: false, ...handleApiError(error, 'Failed to unfollow user') };
    }
  },

  /**
   * Search users
   * @param {string} [query] - Search query (minimum 2 characters)
   * @returns {Promise<Array>} List of matching users
   */
  searchUsers: async (query = '') => {
    try {
      const endpoint = query && query.length >= 2 
        ? `/api/users/search/${query}`
        : '/api/users/search';
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      logError('Error searching users:', error);
      return [];
    }
  },

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} User data or null if not found
   */
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

