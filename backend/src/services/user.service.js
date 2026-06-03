const userRepository = require('../repositories/users/user.repository');
const achievementService = require('./achievement.service');
const followService = require('./follow.service');
const { NotFoundError } = require('../core/errors/AppError');
const logger = require('../core/logger');

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    stats: user.stats,
    profile: user.profile,
    preferences: user.preferences,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

const userService = {
  async getProfile(userId) {
    const user = await userRepository.findById(userId, '-password');
    if (!user) throw new NotFoundError('User not found');
    return serializeUser(user);
  },

  async getFullProfile(userId) {
    const user = await userRepository.findById(userId, '-password');
    if (!user) throw new NotFoundError('User not found');

    const [socialStats, achievementResult] = await Promise.all([
      followService.getSocialStats(userId),
      achievementService.getUserAchievements(userId, { page: 1, limit: 20 }),
    ]);

    return {
      ...serializeUser(user),
      stats: {
        ...user.stats,
        followers: socialStats.followers,
        following: socialStats.following,
      },
      achievements: achievementResult.achievements.map((achievement) => ({
        id: achievement._id,
        title: achievement.title,
        emoji: achievement.emoji,
        type: achievement.type,
      })),
    };
  },

  async updateProfile(userId, data = {}) {
    const update = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.bio !== undefined) update['profile.bio'] = data.bio;

    const user = await userRepository.updateById(userId, {
      $set: update,
    });

    if (!user) throw new NotFoundError('User not found');
    logger.info({ userId }, 'User profile updated');
    return serializeUser(user);
  },

  async updateStats(userId, stats) {
    const user = await userRepository.updateById(userId, { $set: { stats } });
    if (!user) throw new NotFoundError('User not found');
    logger.info({ userId }, 'User stats updated');
    return user.stats;
  },

  async searchUsers(query) {
    if (!query?.trim()) return [];
    return userRepository.search(query.trim());
  },

  async getUserById(userId) {
    const user = await userRepository.findById(userId, '-password -email');
    if (!user) throw new NotFoundError('User not found');
    return serializeUser(user);
  },
};

module.exports = userService;
