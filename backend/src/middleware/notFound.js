const { NotFoundError } = require('../core/errors/AppError');

function notFound(req, res, next) {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
}

module.exports = notFound;
