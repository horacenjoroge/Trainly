// utils/imageUtils.js
import { log } from './logger';

const API_URL = __DEV__ 
  ? 'http://192.168.100.88:3000'  // Local development
  : 'https://trainly-backend-production.up.railway.app';  // Production

/**
 * Safely handle image URIs of various formats
 * Handles local images, file URIs, server paths, and full URLs
 */
export const getSafeImageUri = (imageSource) => {
  // If it's already a require statement (local image), return as is
  if (typeof imageSource !== 'string') {
    return imageSource;
  }

  // Handle null, undefined or empty string
  if (!imageSource || imageSource === 'null' || imageSource === 'undefined') {
    return require('../assets/images/bike.jpg');
  }

  // Handle file:// URIs (from device storage)
  if (imageSource.startsWith('file://')) {
    return { uri: imageSource };
  }
  
  // Handle paths that start with "/data/" (internal storage paths)
  if (imageSource.startsWith('/data/')) {
    return { uri: `file://${imageSource}` };
  }
  
  // Handle paths that directly reference ExperienceData
  if (imageSource.includes('ExperienceData')) {
    return { uri: imageSource };
  }
  
  // Handle server paths that start with /uploads/ or just /
  if (imageSource.startsWith('/uploads/') || imageSource.startsWith('/')) {
    return { uri: `${API_URL}${imageSource}` };
  }
  
  // Handle full URLs
  if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
    return { uri: imageSource };
  }
  
  // Handle literal "default-avatar-url" string
  if (imageSource === 'default-avatar-url') {
    return require('../assets/images/bike.jpg');
  }
  
  // If it's a local path without http, add the base URL
  if (imageSource && !imageSource.startsWith('/')) {
    return { uri: `${API_URL}/${imageSource}` };
  }
  
  // Fallback to default image
  return require('../assets/images/bike.jpg');
};