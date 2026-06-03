const test = require('node:test');
const assert = require('node:assert/strict');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trainly-test';

const { validateRequest } = require('../../src/api/validators/shared');
const { registerSchema } = require('../../src/api/validators/auth.validator');
const { createWorkoutSchema } = require('../../src/api/validators/workout.validator');
const { contactBodySchema } = require('../../src/api/validators/contact.validator');

test('registerSchema rejects weak passwords', () => {
  const result = registerSchema.safeParse({
    name: 'Horace Demo',
    email: 'horace.demo@trainly.dev',
    password: 'weakpass',
  });

  assert.equal(result.success, false);
  assert.match(result.error.errors[0].message, /letter and a number/i);
});

test('createWorkoutSchema coerces numeric strings and accepts valid workout payloads', () => {
  const result = createWorkoutSchema.safeParse({
    type: 'Running',
    duration: '1800',
    calories: '320',
    distance: '5000',
    privacy: 'public',
  });

  assert.equal(result.success, true);
  assert.equal(result.data.duration, 1800);
  assert.equal(result.data.calories, 320);
  assert.equal(result.data.distance, 5000);
});

test('contactBodySchema requires a phone number', () => {
  const result = contactBodySchema.safeParse({
    name: 'Coach Sam',
    relationship: 'Coach',
  });

  assert.equal(result.success, false);
  assert.ok(result.error.errors.some((item) => item.path[0] === 'phoneNumber'));
});

test('validateRequest stores parsed values on req.validated', () => {
  const middleware = validateRequest({
    body: createWorkoutSchema,
  });

  const req = {
    body: {
      type: 'Cycling',
      duration: '900',
      calories: '250',
    },
  };

  middleware(req, {}, (err) => {
    assert.equal(err, undefined);
  });

  assert.equal(req.validated.body.duration, 900);
  assert.equal(req.validated.body.calories, 250);
});

test('validateRequest forwards structured validation errors', () => {
  const middleware = validateRequest({
    body: createWorkoutSchema,
  });

  const req = {
    body: {
      duration: -1,
    },
  };

  let capturedError = null;
  middleware(req, {}, (err) => {
    capturedError = err;
  });

  assert.equal(capturedError.code, 'VALIDATION_ERROR');
  assert.equal(Array.isArray(capturedError.meta.errors), true);
  assert.ok(capturedError.meta.errors.some((item) => item.field === 'type'));
});
