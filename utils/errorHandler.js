/**
 * Centralized error handling utility
 * Provides consistent error format across the application
 */

import { logError } from './logger';

/**
 * Standard error response format
 * @typedef {Object} ErrorResponse
 * @property {boolean} success - Always false for errors
 * @property {string} message - Human-readable error message
 * @property {string} [code] - Error code for programmatic handling
 * @property {any} [data] - Additional error data
 */

/**
 * Handle API errors and return standardized format
 * @param {Error} error - The error object
 * @param {string} [defaultMessage] - Default message if error doesn't have one
 * @returns {ErrorResponse}
 */
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  logError('API Error:', error);

  // Axios error structure
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error || defaultMessage;

    return {
      success: false,
      message,
      code: `API_${status}`,
      data: error.response.data,
    };
  }

  // Network error
  if (error.request) {
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
    };
  }

  // Generic error
  return {
    success: false,
    message: error.message || defaultMessage,
    code: 'UNKNOWN_ERROR',
  };
};

/**
 * Handle validation errors
 * @param {Object} errors - Validation errors object
 * @returns {ErrorResponse}
 */
export const handleValidationError = (errors) => {
  const messages = Object.values(errors).filter(Boolean);
  return {
    success: false,
    message: messages.length > 0 ? messages[0] : 'Validation failed',
    code: 'VALIDATION_ERROR',
    data: errors,
  };
};

/**
 * Create a standardized error response
 * @param {string} message - Error message
 * @param {string} [code] - Error code
 * @param {any} [data] - Additional data
 * @returns {ErrorResponse}
 */
export const createError = (message, code = 'ERROR', data = null) => {
  return {
    success: false,
    message,
    code,
    data,
  };
};

/**
 * Create a standardized success response
 * @param {any} data - Response data
 * @param {string} [message] - Success message
 * @returns {Object}
 */
export const createSuccess = (data, message = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
};

export default {
  handleApiError,
  handleValidationError,
  createError,
  createSuccess,
};

