class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', meta = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.meta = meta;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = []) {
    super(message, 400, 'VALIDATION_ERROR', { errors });
  }
}

class AuthError extends AppError {
  constructor(message = 'Authentication required') { super(message, 401, 'AUTH_ERROR'); }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') { super(message, 403, 'FORBIDDEN'); }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') { super(message, 404, 'NOT_FOUND'); }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') { super(message, 409, 'CONFLICT'); }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests') { super(message, 429, 'RATE_LIMIT'); }
}

class ExternalServiceError extends AppError {
  constructor(message = 'External service error', meta = {}) { super(message, 502, 'EXTERNAL_SERVICE', meta); }
}

module.exports = { AppError, ValidationError, AuthError, ForbiddenError, NotFoundError, ConflictError, RateLimitError, ExternalServiceError };
