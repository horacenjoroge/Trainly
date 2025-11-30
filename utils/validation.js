// utils/validation.js

/**
 * Validation rules for common form fields
 */
export const validationRules = {
  fullName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Full name must contain only letters and spaces, minimum 2 characters',
  },
  username: {
    required: true,
    minLength: 3,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: 'Username must contain only letters, numbers, and underscores, minimum 3 characters',
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)/,
    message: 'Password must be at least 8 characters and contain at least one letter and one number',
  },
  phone: {
    required: false,
    pattern: /^[\+]?[0-9\s\-\(\)]+$/,
    minLength: 10,
    message: 'Please enter a valid phone number (minimum 10 digits)',
  },
  dateOfBirth: {
    required: false,
    pattern: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/,
    message: 'Please enter date in DD/MM/YYYY format',
  },
  gender: {
    required: false,
    pattern: /^(male|female|other)$/i,
    message: 'Gender must be Male, Female, or Other',
  },
  height: {
    required: false,
    pattern: /^[0-9]+$/,
    min: 100,
    max: 250,
    message: 'Height must be between 100-250 cm',
  },
  weight: {
    required: false,
    pattern: /^[0-9]+(\.[0-9]+)?$/,
    min: 30,
    max: 300,
    message: 'Weight must be between 30-300 kg',
  },
  fitnessLevel: {
    required: false,
    pattern: /^(beginner|intermediate|advanced)$/i,
    message: 'Fitness level must be Beginner, Intermediate, or Advanced',
  },
  bio: {
    required: false,
    maxLength: 150,
    message: 'Bio must be less than 150 characters',
  },
};

/**
 * Validate a single field value against its rules
 * 
 * @param {string} fieldName - Name of the field to validate
 * @param {string} value - Value to validate
 * @param {Object} customRules - Optional custom rules to override defaults
 * @returns {string|null} Error message or null if valid
 */
export const validateField = (fieldName, value, customRules = {}) => {
  const rules = customRules[fieldName] || validationRules[fieldName];
  
  if (!rules) return null;

  // Check if required field is empty
  if (rules.required && (!value || value.trim() === '')) {
    return `${fieldName} is required`;
  }

  // Skip validation for optional empty fields
  if (!rules.required && (!value || value.trim() === '')) {
    return null;
  }

  // Trim the value for validation
  const trimmedValue = value.trim();

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    return rules.message;
  }

  // Length validation
  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return rules.message;
  }

  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    return rules.message;
  }

  // Numeric range validation
  if (rules.min !== undefined || rules.max !== undefined) {
    const numValue = parseFloat(trimmedValue);
    if (isNaN(numValue)) {
      return rules.message;
    }
    if (rules.min !== undefined && numValue < rules.min) {
      return rules.message;
    }
    if (rules.max !== undefined && numValue > rules.max) {
      return rules.message;
    }
  }

  return null;
};

/**
 * Validate multiple fields at once
 * 
 * @param {Object} fields - Object with field names as keys and values as values
 * @param {Object} customRules - Optional custom rules
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const validateFields = (fields, customRules = {}) => {
  const errors = {};
  
  Object.keys(fields).forEach(fieldName => {
    const error = validateField(fieldName, fields[fieldName], customRules);
    if (error) {
      errors[fieldName] = error;
    }
  });
  
  return errors;
};

/**
 * Check if email is valid
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  return validationRules.email.pattern.test(email);
};

/**
 * Check if password meets requirements
 * 
 * @param {string} password - Password to validate
 * @returns {Object} Object with isValid boolean and message string
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters',
    };
  }
  
  if (!validationRules.password.pattern.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one letter and one number',
    };
  }
  
  return {
    isValid: true,
    message: '',
  };
};

