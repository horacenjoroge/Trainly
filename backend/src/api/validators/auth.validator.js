const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/(?=.*[a-zA-Z])(?=.*[0-9])/, 'Password must contain a letter and a number'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({ refreshToken: z.string().min(1, 'Refresh token required') });

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 'error', code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors: result.error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    req.validated = result.data;
    next();
  };
}

module.exports = { registerSchema, loginSchema, refreshSchema, validate };
