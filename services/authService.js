// services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './api';
import { log, logError } from '../utils/logger';
import { handleApiError } from '../utils/errorHandler';

/**
 * Authentication service
 * Handles user authentication, registration, and emergency contacts
 */
export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Response data with token and user
   */
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
      throw handleApiError(error, 'Registration failed');
    }
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials (email, password)
   * @returns {Promise<Object>} Response data with token and user
   */
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
      throw handleApiError(error, 'Login failed');
    }
  },

  /**
   * Logout user
   * @returns {Promise<boolean>} Success status
   */
  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userData');
      log('Logged out, tokens cleared');
      return true;
    } catch (error) {
      logError('Logout error:', error);
      return false;
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} Current user data
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/api/auth/user');
      return response.data;
    } catch (error) {
      logError('Error getting current user:', error);
      throw handleApiError(error, 'Failed to get current user');
    }
  },

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>} Authentication status
   */
  isAuthenticated: async () => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  },

  /**
   * Manually refresh token
   * @returns {Promise<boolean>} Success status
   */
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

  /**
   * Get emergency contacts
   * @returns {Promise<Array>} List of emergency contacts
   */
  getContacts: async () => {
    try {
      log('Sending GET /api/contacts request...');
      const response = await apiClient.get('/api/contacts');
      log('Received response from GET /api/contacts:', response.data);
      return response.data;
    } catch (error) {
      logError('Error getting contacts:', error);
      throw handleApiError(error, 'Failed to get emergency contacts');
    }
  },

  /**
   * Add a new emergency contact
   * @param {Object} data - Contact data
   * @returns {Promise<Object>} Created contact
   */
  addContact: async (data) => {
    try {
      log('Sending POST /api/contacts request with data:', data);
      const response = await apiClient.post('/api/contacts', data);
      log('Received response from POST /api/contacts:', response.data);
      return response.data;
    } catch (error) {
      logError('Error adding contact:', error);
      throw handleApiError(error, 'Failed to add emergency contact');
    }
  },

  /**
   * Update an existing emergency contact
   * @param {string} id - Contact ID
   * @param {Object} data - Updated contact data
   * @returns {Promise<Object>} Updated contact
   */
  updateContact: async (id, data) => {
    try {
      log(`Sending PUT /api/contacts/${id} request with data:`, data);
      const response = await apiClient.put(`/api/contacts/${id}`, data);
      log(`Received response from PUT /api/contacts/${id}:`, response.data);
      return response.data;
    } catch (error) {
      logError('Error updating contact:', error);
      throw handleApiError(error, 'Failed to update emergency contact');
    }
  },

  /**
   * Delete an emergency contact
   * @param {string} id - Contact ID
   * @returns {Promise<Object>} Deletion result
   */
  deleteContact: async (id) => {
    try {
      log(`Sending DELETE /api/contacts/${id} request...`);
      const response = await apiClient.delete(`/api/contacts/${id}`);
      log(`Received response from DELETE /api/contacts/${id}:`, response.data);
      return response.data;
    } catch (error) {
      logError('Error deleting contact:', error);
      throw handleApiError(error, 'Failed to delete emergency contact');
    }
  },

  /**
   * Send SOS message
   * @param {Object} data - SOS message data
   * @returns {Promise<Object>} SOS response
   */
  sendSOS: async (data) => {
    try {
      log('Sending POST /api/contacts/send-sos request with data:', data);
      const response = await apiClient.post('/api/contacts/send-sos', data);
      log('Received response from POST /api/contacts/send-sos:', response);
      return response;
    } catch (error) {
      logError('Error sending SOS:', error);
      throw handleApiError(error, 'Failed to send SOS message');
    }
  },
};

