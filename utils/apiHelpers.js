// utils/apiHelpers.js
import { log } from './logger';

/**
 * Build query string from parameters object
 * 
 * @param {Object} params - Parameters object
 * @returns {string} Query string (e.g., "?key1=value1&key2=value2")
 */
export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const queryParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Create FormData from object (for file uploads)
 * 
 * @param {Object} data - Data object
 * @param {Object} files - Files object with field names as keys
 * @returns {FormData} FormData object
 */
export const createFormData = (data = {}, files = {}) => {
  const formData = new FormData();

  // Add regular fields
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  // Add files
  Object.keys(files).forEach(key => {
    const file = files[key];
    if (file) {
      if (typeof file === 'string') {
        // If it's a URI string, create file object
        const filename = file.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append(key, {
          uri: file,
          name: filename,
          type,
        });
      } else {
        // If it's already a file object
        formData.append(key, file);
      }
    }
  });

  return formData;
};

/**
 * Get file extension from URI
 * 
 * @param {string} uri - File URI
 * @returns {string} File extension (e.g., "jpg", "png")
 */
export const getFileExtension = (uri) => {
  if (!uri) return 'jpg';
  
  const match = /\.(\w+)$/.exec(uri.split('/').pop());
  return match ? match[1].toLowerCase() : 'jpg';
};

/**
 * Get MIME type from file extension
 * 
 * @param {string} extension - File extension
 * @returns {string} MIME type
 */
export const getMimeType = (extension) => {
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };

  return mimeTypes[extension?.toLowerCase()] || 'application/octet-stream';
};

/**
 * Log API request for debugging
 * 
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {any} [data] - Request data
 */
export const logRequest = (method, url, data = null) => {
  log(`API Request: ${method.toUpperCase()} ${url}`, data ? { data } : '');
};

/**
 * Log API response for debugging
 * 
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {any} [data] - Response data
 */
export const logResponse = (method, url, data = null) => {
  log(`API Response: ${method.toUpperCase()} ${url}`, data ? { data } : '');
};

/**
 * Retry API request with exponential backoff
 * 
 * @param {Function} requestFn - Function that returns a promise
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise} Request promise
 */
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on 4xx errors (client errors)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const waitTime = delay * Math.pow(2, i);
      
      if (i < maxRetries - 1) {
        log(`Request failed, retrying in ${waitTime}ms... (attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError;
};
