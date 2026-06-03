const test = require('node:test');
const assert = require('node:assert/strict');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'test-refresh-secret';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trainly-test';

const authService = require('../../src/services/auth.service');
const userRepository = require('../../src/repositories/users/user.repository');
const cache = require('../../src/infrastructure/cache');
const bcrypt = require('bcryptjs');
const { AuthError, ConflictError } = require('../../src/core/errors/AppError');
const { stubMethods } = require('../../test-support/stub');

test('authService.register creates a user and returns tokens', async () => {
  const restore = stubMethods(userRepository, {
    findOne: async () => null,
    create: async (data) => ({
      id: 'user-1',
      name: data.name,
      email: data.email,
    }),
  });

  try {
    const result = await authService.register({
      name: 'Horace Demo',
      email: 'horace.demo@trainly.dev',
      password: 'Password123',
    });

    assert.equal(result.user.id, 'user-1');
    assert.equal(result.user.email, 'horace.demo@trainly.dev');
    assert.equal(typeof result.token, 'string');
    assert.equal(typeof result.refreshToken, 'string');
  } finally {
    restore();
  }
});

test('authService.register rejects duplicate users', async () => {
  const restore = stubMethods(userRepository, {
    findOne: async () => ({ id: 'existing-user' }),
  });

  try {
    await assert.rejects(
      authService.register({
        name: 'Horace Demo',
        email: 'horace.demo@trainly.dev',
        password: 'Password123',
      }),
      ConflictError,
    );
  } finally {
    restore();
  }
});

test('authService.login returns user payload for valid credentials', async () => {
  const restoreRepo = stubMethods(userRepository, {
    findOne: async () => ({
      id: 'user-2',
      name: 'Amina Demo',
      email: 'amina.demo@trainly.dev',
      password: 'hashed-password',
      avatar: '/uploads/avatars/amina.png',
      stats: { workoutsCompleted: 12 },
    }),
  });
  const restoreBcrypt = stubMethods(bcrypt, {
    compare: async () => true,
  });

  try {
    const result = await authService.login({
      email: 'amina.demo@trainly.dev',
      password: 'Password123',
    });

    assert.equal(result.user.id, 'user-2');
    assert.equal(result.user.avatar, '/uploads/avatars/amina.png');
    assert.equal(result.user.stats.workoutsCompleted, 12);
    assert.equal(typeof result.token, 'string');
  } finally {
    restoreBcrypt();
    restoreRepo();
  }
});

test('authService.login rejects invalid credentials', async () => {
  const restoreRepo = stubMethods(userRepository, {
    findOne: async () => ({
      id: 'user-2',
      email: 'amina.demo@trainly.dev',
      password: 'hashed-password',
    }),
  });
  const restoreBcrypt = stubMethods(bcrypt, {
    compare: async () => false,
  });

  try {
    await assert.rejects(
      authService.login({
        email: 'amina.demo@trainly.dev',
        password: 'wrong-password',
      }),
      AuthError,
    );
  } finally {
    restoreBcrypt();
    restoreRepo();
  }
});

test('authService.refreshToken rotates a valid refresh token', async () => {
  const restoreRepo = stubMethods(userRepository, {
    findOne: async () => null,
    create: async () => ({
      id: 'refresh-user',
      name: 'Grace Demo',
      email: 'grace.demo+refresh@trainly.dev',
    }),
    findById: async () => ({
      id: 'refresh-user',
      name: 'Grace Demo',
      email: 'grace.demo+refresh@trainly.dev',
    }),
  });
  const restoreCache = stubMethods(cache, {
    isTokenBlacklisted: async () => false,
    blacklistToken: async () => {},
  });

  try {
    const registration = await authService.register({
      name: 'Grace Demo',
      email: 'grace.demo+refresh@trainly.dev',
      password: 'Password123',
    });

    const refreshed = await authService.refreshToken(registration.refreshToken);

    assert.equal(typeof refreshed.token, 'string');
    assert.equal(typeof refreshed.refreshToken, 'string');
  } finally {
    restoreCache();
    restoreRepo();
  }
});

test('authService.refreshToken rejects revoked refresh tokens', async () => {
  const restoreCache = stubMethods(cache, {
    isTokenBlacklisted: async () => true,
    blacklistToken: async () => {},
  });

  try {
    const registrationRestore = stubMethods(userRepository, {
      findOne: async () => null,
      create: async () => ({
        id: 'revoked-user',
        name: 'David Demo',
        email: 'david.demo@trainly.dev',
      }),
    });

    const registration = await authService.register({
      name: 'David Demo',
      email: 'david.demo@trainly.dev',
      password: 'Password123',
    });

    registrationRestore();

    await assert.rejects(
      authService.refreshToken(registration.refreshToken),
      AuthError,
    );
  } finally {
    restoreCache();
  }
});
