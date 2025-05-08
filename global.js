// global.js
import React from 'react';
import { Image as RNImage, Text } from 'react-native';

// Save original components
const OriginalImage = RNImage;

// Create a safer Image component
function SafeImage(props) {
  const safeProps = {...props};
  
  // Handle source uri that's not a string
  if (safeProps.source && safeProps.source.uri !== undefined) {
    // Convert non-string URI to string
    if (typeof safeProps.source.uri !== 'string') {
      console.warn('Converting non-string URI to string:', JSON.stringify(safeProps.source.uri));
      safeProps.source = {
        ...safeProps.source,
        uri: String(safeProps.source.uri || '')
      };
    }
    
    // Handle null URIs
    if (safeProps.source.uri === 'null' || safeProps.source.uri === 'undefined') {
      console.warn('Fixing null/undefined URI');
      safeProps.source = require('./assets/images/trail.jpg'); // Add a placeholder image to your assets folder
    }
  }
  
  return React.createElement(OriginalImage, safeProps);
}

// Replace the Image component globally
global.Image = SafeImage;
global.OriginalImage = OriginalImage;

// Also override the imported Image to be safe
Object.defineProperty(require('react-native'), 'Image', {
  get: () => SafeImage
});

// Add some debug helpers
global.__fixImageUri = (uri) => {
  if (uri === null || uri === undefined) return '';
  return String(uri);
};

console.log('Image component patched for safety!');