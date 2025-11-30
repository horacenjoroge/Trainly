/**
 * @deprecated This file contains duplicate/unused API client code.
 * Use services/api.js as the single source of truth for API calls.
 * 
 * This file is kept for backward compatibility but should not be used.
 * All API calls should use the apiClient from services/api.js
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError } from './logger';

// NOTE: These functions use 'accessToken' key which is inconsistent with the main app
// The main app uses 'token' key. These are kept for reference only.

// Store tokens (DEPRECATED - use AuthContext instead)
export const storeTokens = async (accessToken, refreshToken) => {
  try {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
  } catch (error) {
    logError('Error storing tokens:', error);
  }
};

// Get access token (DEPRECATED - use AuthContext instead)
export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem('accessToken');
  } catch (error) {
    logError('Error getting access token:', error);
    return null;
  }
};

// Get refresh token (DEPRECATED - use AuthContext instead)
export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem('refreshToken');
  } catch (error) {
    logError('Error getting refresh token:', error);
    return null;
  }
};

// NOTE: apiClient export removed - use services/api.js instead
// NOTE: refreshAccessToken removed - use authService.refreshToken from services/api.js
// NOTE: logout removed - use authService.logout from services/api.js