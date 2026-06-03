const followRepository = require('../repositories/follows/follow.repository');
const userRepository = require('../repositories/users/user.repository');
const { ConflictError, NotFoundError, ValidationError } = require('../core/errors/AppError');
const logger = require('../core/logger');

const followService = {
  async followUser(currentUserId, targetUserId) {
    if (currentUserId.toString() === targetUserId.toString()) {
      throw new ValidationError('You cannot follow yourself', [
        { field: 'userId', message: 'You cannot follow yourself' },
      ]);
    }

    const user = await userRepository.findById(targetUserId);
    if (!user) throw new NotFoundError('User not found');

    const existing = await followRepository.findRelationship(currentUserId, targetUserId);
    if (existing) throw new ConflictError('Already following this user');

    await followRepository.create({ follower: currentUserId, following: targetUserId });
    logger.info({ userId: currentUserId, targetUserId }, 'User followed');
    return { message: 'User followed successfully' };
  },

  async unfollowUser(currentUserId, targetUserId) {
    const relationship = await followRepository.deleteRelationship(currentUserId, targetUserId);
    if (!relationship) throw new ValidationError('You are not following this user', [
      { field: 'userId', message: 'You are not following this user' },
    ]);

    logger.info({ userId: currentUserId, targetUserId }, 'User unfollowed');
    return { message: 'User unfollowed successfully' };
  },

  async getFollowers(userId) {
    const followers = await followRepository.findFollowers(userId);
    return followers.map((item) => item.follower);
  },

  async getFollowing(userId) {
    const following = await followRepository.findFollowing(userId);
    return following.map((item) => item.following);
  },

  async getSocialStats(userId) {
    const [followers, following] = await Promise.all([
      followRepository.countFollowers(userId),
      followRepository.countFollowing(userId),
    ]);

    return { followers, following };
  },
};

module.exports = followService;
