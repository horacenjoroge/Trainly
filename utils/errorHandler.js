// utils/errorHandler.js
import { logError } from './logger';

/**
 * Standard error response format
 * @typedef {Object} ErrorResponse
 * @property {boolean} success - Always false for errors
 * @property {string} message - Error message
 * @property {any} [data] - Optional error data
 */

/**
 * Centralized error handling for API responses
 * 
 * @param {Error} error - Error object from API call
 * @param {string} [defaultMessage] - Default error message if none found
 * @returns {ErrorResponse} Standardized error response
 */
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  logError('API Error:', {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
    url: error.config?.url,
  });

  // Network error (no response)
  if (!error.response) {
    return {
      success: false,
      message: error.message || 'Network error. Please check your connection.',
      data: null,
    };
  }

  // Server responded with error
  const status = error.response.status;
  const responseData = error.response.data;

  // Try to extract message from response
  let message = defaultMessage;
  if (responseData?.message) {
    message = responseData.message;
  } else if (responseData?.error) {
    message = responseData.error;
  } else if (typeof responseData === 'string') {
    message = responseData;
  }

  // Add status-specific messages
  switch (status) {
    case 400:
      message = message || 'Invalid request. Please check your input.';
      break;
    case 401:
      message = message || 'Authentication required. Please login again.';
      break;
    case 403:
      message = message || 'You do not have permission to perform this action.';
      break;
    case 404:
      message = message || 'Resource not found.';
      break;
    case 409:
      message = message || 'Conflict. This resource already exists.';
      break;
    case 422:
      message = message || 'Validation error. Please check your input.';
      break;
    case 429:
      message = message || 'Too many requests. Please try again later.';
      break;
    case 500:
      message = message || 'Server error. Please try again later.';
      break;
    case 503:
      message = message || 'Service unavailable. Please try again later.';
      break;
    default:
      message = message || `Error ${status}. Please try again.`;
  }

  return {
    success: false,
    message,
    data: responseData,
    status,
  };
};

/**
 * Check if error is a network error
 * 
 * @param {Error} error - Error object
 * @returns {boolean} True if network error
 */
export const isNetworkError = (error) => {
  return !error.response && (error.message?.includes('Network') || error.code === 'NETWORK_ERROR');
};

/**
 * Check if error is an authentication error
 * 
 * @param {Error} error - Error object
 * @returns {boolean} True if auth error
 */
export const isAuthError = (error) => {
  return error.response?.status === 401 || error.response?.status === 403;
};

/**
 * Extract validation errors from error response
 * 
 * @param {Error} error - Error object
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const extractValidationErrors = (error) => {
  if (!error.response?.data) {
    return {};
  }

  const data = error.response.data;
  
  // Handle different validation error formats
  if (data.errors && typeof data.errors === 'object') {
    return data.errors;
  }
  
  if (data.validationErrors && typeof data.validationErrors === 'object') {
    return data.validationErrors;
  }
  
  if (data.fields && typeof data.fields === 'object') {
    return data.fields;
  }

  return {};
};
