// utils/imageUtils.js
const API_URL = 'http://192.168.100.88:3000'; // Your server URL

export const getSafeImageUri = (imageSource) => {
  console.log('Getting image for source:', imageSource);
  
  // If it's already a require statement (local image), return as is
  if (typeof imageSource !== 'string') {
    return imageSource;
  }
  
  // Handle null, undefined or empty string
  if (!imageSource) {
    return require('../assets/images/bike.jpg');
  }
  
  // Handle literal "default-avatar-url" string
  if (imageSource === 'default-avatar-url') {
    return require('../assets/images/bike.jpg');
  }
  
  // Handle server paths that start with /uploads/
  if (imageSource.startsWith('/uploads/')) {
    const fullUri = `${API_URL}${imageSource}`;
    console.log('Server path converted to:', fullUri);
    return { uri: fullUri };
  }
  
  // Handle full URLs
  if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
    return { uri: imageSource };
  }
  
  // Handle file:/// URLs by using a fallback
  if (imageSource.startsWith('file:///')) {
    console.log('Local file URI detected, using fallback image');
    return require('../assets/images/bike.jpg');
  }
  
  // Fallback to default image for any other case
  return require('../assets/images/bike.jpg');
};