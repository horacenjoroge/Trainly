const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../core/config');
const userRepository = require('../repositories/users/user.repository');
const cache = require('../infrastructure/cache');
const { AuthError, ConflictError, ValidationError } = require('../core/errors/AppError');
const logger = require('../core/logger');

const authService = {
  async register({ name, email, password }) {
    const existing = await userRepository.findOne({ email });
    if (existing) throw new ConflictError('User already exists');
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await userRepository.create({ name, email, password: hashed });
    const tokens = generateTokens(user.id);
    logger.info({ userId: user.id }, 'User registered');
    return { user: { id: user.id, name: user.name, email: user.email }, ...tokens };
  },

  async login({ email, password }) {
    const user = await userRepository.findOne({ email });
    if (!user) throw new AuthError('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AuthError('Invalid credentials');
    const tokens = generateTokens(user.id);
    logger.info({ userId: user.id }, 'User logged in');
    return { user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, stats: user.stats }, ...tokens };
  },

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET || config.JWT_SECRET);
      const jti = decoded.jti || decoded.user?.id || decoded.id;
      if (await cache.isTokenBlacklisted(`rt:${jti}`)) throw new AuthError('Token has been revoked');
      await cache.blacklistToken(`rt:${jti}`, 86400);
      const user = await userRepository.findById(decoded.user?.id || decoded.id);
      if (!user) throw new AuthError('User not found');
      return generateTokens(user.id);
    } catch (err) {
      if (err instanceof AuthError) throw err;
      throw new AuthError('Invalid refresh token');
    }
  },

  async logout(userId, tokenJti) {
    if (tokenJti) await cache.blacklistToken(tokenJti, 86400);
    logger.info({ userId }, 'User logged out');
  },

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId, '-password');
    if (!user) throw new AuthError('User not found');
    return user;
  }
};

function generateTokens(userId) {
  const accessToken = jwt.sign({ user: { id: userId } }, config.JWT_SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ user: { id: userId }, jti: require('uuid').v4() }, config.REFRESH_TOKEN_SECRET || config.JWT_SECRET, { expiresIn: '30d' });
  return { token: accessToken, refreshToken };
}

module.exports = authService;
