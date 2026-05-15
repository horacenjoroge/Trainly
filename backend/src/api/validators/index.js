const authValidator = require('./auth.validator');
const workoutValidator = require('./workout.validator');

function validate(schema) {
  return (req, res, next) => {
    const target = req.method === 'GET' ? req.query : req.body;
    const result = schema.safeParse(target);
    if (!result.success) {
      return res.status(400).json({
        status: 'error', code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors: result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    if (req.method === 'GET') req.validated = result.data;
    else req.validated = result.data;
    next();
  };
}

module.exports = { validate, authValidator, workoutValidator };
