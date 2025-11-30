// utils/dateUtils.js

/**
 * Format date to relative time string (e.g., "2 hours ago", "3 days ago")
 * 
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const then = new Date(date);
  
  if (isNaN(then.getTime())) return '';
  
  const diffInSeconds = Math.floor((now - then) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  return then.toLocaleDateString();
};

/**
 * Format date to short date string (e.g., "Jan 15, 2024")
 * 
 * @param {Date|string} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return dateObj.toLocaleDateString(undefined, defaultOptions);
};

/**
 * Format date to time string (e.g., "2:30 PM")
 * 
 * @param {Date|string} date - Date to format
 * @param {boolean} includeSeconds - Include seconds in output
 * @returns {string} Formatted time string
 */
export const formatTime = (date, includeSeconds = false) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' }),
  };
  
  return dateObj.toLocaleTimeString(undefined, options);
};

/**
 * Format date to date and time string (e.g., "Jan 15, 2024 at 2:30 PM")
 * 
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  return `${formatDate(dateObj)} at ${formatTime(dateObj)}`;
};

/**
 * Check if date is today
 * 
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return false;
  
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if date is yesterday
 * 
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is yesterday
 */
export const isYesterday = (date) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return false;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return dateObj.toDateString() === yesterday.toDateString();
};

/**
 * Format date with smart display (Today, Yesterday, or formatted date)
 * 
 * @param {Date|string} date - Date to format
 * @param {boolean} includeTime - Include time in output
 * @returns {string} Formatted date string
 */
export const formatSmartDate = (date, includeTime = false) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  if (isToday(dateObj)) {
    return includeTime ? `Today at ${formatTime(dateObj)}` : 'Today';
  }
  
  if (isYesterday(dateObj)) {
    return includeTime ? `Yesterday at ${formatTime(dateObj)}` : 'Yesterday';
  }
  
  return includeTime ? formatDateTime(dateObj) : formatDate(dateObj);
};

/**
 * Format duration in seconds to readable string (e.g., "1h 30m", "45m")
 * 
 * @param {number} seconds - Duration in seconds
 * @param {boolean} showSeconds - Include seconds in output
 * @returns {string} Formatted duration string
 */
export const formatDuration = (seconds, showSeconds = false) => {
  if (!seconds || seconds < 0) return '0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts = [];
  
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  
  if (minutes > 0 || hours === 0) {
    parts.push(`${minutes}m`);
  }
  
  if (showSeconds && secs > 0 && hours === 0) {
    parts.push(`${secs}s`);
  }
  
  return parts.join(' ') || '0m';
};

/**
 * Get start of day for a given date
 * 
 * @param {Date|string} date - Date to get start of day for
 * @returns {Date} Start of day date
 */
export const getStartOfDay = (date) => {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
};

/**
 * Get end of day for a given date
 * 
 * @param {Date|string} date - Date to get end of day for
 * @returns {Date} End of day date
 */
export const getEndOfDay = (date) => {
  const dateObj = new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
};

/**
 * Get date range for a period (week, month, year)
 * 
 * @param {string} period - 'week' | 'month' | 'year'
 * @returns {Object} Object with start and end dates
 */
export const getDateRange = (period) => {
  const now = new Date();
  const start = new Date();
  
  switch (period) {
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(now.getFullYear() - 1);
      break;
    default:
      start.setFullYear(2000); // Default to all time
  }
  
  return {
    start: getStartOfDay(start),
    end: getEndOfDay(now),
  };
};

