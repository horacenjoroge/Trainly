/**
 * Logger utility for Trainly app
 * Gates console logs based on environment
 * Use this instead of console.log/error/warn directly
 */

const isDevelopment = __DEV__;

/**
 * Log info messages (only in development)
 */
export const log = (...args) => {
  if (isDevelopment) {
    console.log('[Trainly]', ...args);
  }
};

/**
 * Log error messages (always logged)
 */
export const logError = (...args) => {
  if (isDevelopment) {
    console.error('[Trainly Error]', ...args);
  }
  // In production, you could send to error tracking service
  // Example: Sentry.captureException(...args);
};

/**
 * Log warning messages (only in development)
 */
export const logWarn = (...args) => {
  if (isDevelopment) {
    console.warn('[Trainly Warn]', ...args);
  }
};

/**
 * Log debug messages (only in development, more verbose)
 */
export const logDebug = (...args) => {
  if (isDevelopment) {
    console.debug('[Trainly Debug]', ...args);
  }
};

/**
 * Log info with grouping (only in development)
 */
export const logGroup = (label, ...args) => {
  if (isDevelopment) {
    console.group(label);
    console.log(...args);
    console.groupEnd();
  }
};

export default {
  log,
  logError,
  logWarn,
  logDebug,
  logGroup,
};

