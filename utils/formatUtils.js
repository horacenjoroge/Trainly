// utils/formatUtils.js

/**
 * Formats duration in seconds to a human-readable string.
 * 
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string (e.g., "2h 30m" or "45m")
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return '0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Formats distance in meters to a human-readable string.
 * 
 * @param {number} distance - Distance in meters
 * @returns {string} Formatted distance string (e.g., "5.2 km" or "450 m")
 */
export const formatDistance = (distance) => {
  if (!distance) return '0 km';
  
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)} km`;
  }
  return `${Math.round(distance)} m`;
};

/**
 * Formats a date to a relative time string (e.g., "2 hours ago").
 * 
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return then.toLocaleDateString();
};

