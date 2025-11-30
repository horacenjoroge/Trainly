// services/postService.js
import apiClient from './api';
import { logError } from '../utils/logger';
import { handleApiError } from '../utils/errorHandler';

/**
 * Post service
 * Handles social media posts, likes, and comments
 */
export const postService = {
  /**
   * Get all posts
   * @returns {Promise<Array>} List of posts
   */
  getPosts: async () => {
    try {
      const response = await apiClient.get('/api/posts');
      return response.data;
    } catch (error) {
      logError('Error fetching posts:', error);
      // Return empty array instead of throwing for feed display
      return [];
    }
  },

  /**
   * Create a new post
   * @param {Object} postData - Post data
   * @returns {Promise<Object>} Created post
   */
  createPost: async (postData) => {
    try {
      const response = await apiClient.post('/api/posts', postData);
      return response.data;
    } catch (error) {
      logError('Error creating post:', error);
      throw handleApiError(error, 'Failed to create post');
    }
  },

  /**
   * Like or unlike a post
   * @param {string} postId - Post ID
   * @returns {Promise<Object>} Updated post with like status
   */
  likePost: async (postId) => {
    try {
      const response = await apiClient.put(`/api/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      logError('Error liking post:', error);
      throw handleApiError(error, 'Failed to like post');
    }
  },

  /**
   * Add a comment to a post
   * @param {string} postId - Post ID
   * @param {Object} commentData - Comment data
   * @returns {Promise<Object>} Created comment
   */
  addComment: async (postId, commentData) => {
    try {
      const response = await apiClient.post(`/api/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      logError('Error adding comment:', error);
      throw handleApiError(error, 'Failed to add comment');
    }
  },

  /**
   * Get comments for a post
   * @param {string} postId - Post ID
   * @returns {Promise<Array>} List of comments
   */
  getComments: async (postId) => {
    try {
      const response = await apiClient.get(`/api/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      logError('Error fetching comments:', error);
      // Return empty array instead of throwing for comment display
      return [];
    }
  },
};

