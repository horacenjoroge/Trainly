const { ValidationError } = require('../../core/errors/AppError');

function formatZodErrors(error) {
  return error.errors.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
}

function validateRequest(schemas = {}) {
  return (req, res, next) => {
    const validated = {};

    for (const [key, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(req[key]);
      if (!result.success) {
        return next(new ValidationError('Validation failed', formatZodErrors(result.error)));
      }
      validated[key] = result.data;
    }

    req.validated = {
      ...(req.validated || {}),
      ...validated,
    };

    return next();
  };
}

module.exports = {
  formatZodErrors,
  validateRequest,
};
