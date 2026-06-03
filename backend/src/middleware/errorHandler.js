const { AppError } = require('../core/errors/AppError');
const logger = require('../core/logger');
const config = require('../core/config');
const metrics = require('../observability/metrics');

function errorHandler(err, req, res, next) {
  if (err.name === 'ValidationError' && err.errors) {
    err.statusCode = 400;
    err.code = 'VALIDATION_ERROR';
  }
  if (err.name === 'CastError') { err = new AppError('Invalid ID format', 400, 'INVALID_ID'); }
  if (err.code === 11000) { err = new AppError('Duplicate entry', 409, 'DUPLICATE'); }
  if (err.name === 'JsonWebTokenError') { err = new AppError('Invalid token', 401, 'JWT_ERROR'); }
  if (err.name === 'TokenExpiredError') { err = new AppError('Token expired', 401, 'JWT_EXPIRED'); }
  if (err.code === 'LIMIT_FILE_SIZE') { err = new AppError('File too large', 400, 'FILE_SIZE'); }
  if (err.name === 'MulterError') { err = new AppError(err.message, 400, err.code || 'UPLOAD_ERROR'); }

  const statusCode = err.statusCode || err.status || 500;
  const response = {
    status: 'error',
    code: err.code || 'INTERNAL_ERROR',
    message: config.NODE_ENV === 'production' && statusCode === 500 ? 'Internal server error' : err.message,
    ...(err.meta && Object.keys(err.meta).length && { meta: err.meta }),
    ...(config.NODE_ENV === 'development' && { stack: err.stack }),
  };

  metrics.recordError();
  if (['FILE_SIZE', 'UPLOAD_ERROR', 'INVALID_UPLOAD_TYPE'].includes(response.code)) {
    metrics.recordUploadFailure();
  }
  logger.error({ err, statusCode, url: req.url, method: req.method }, 'Request error');
  res.status(statusCode).json(response);
}

module.exports = errorHandler;
