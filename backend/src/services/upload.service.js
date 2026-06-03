const storage = require('../infrastructure/storage');
const userRepository = require('../repositories/users/user.repository');
const { NotFoundError, ValidationError } = require('../core/errors/AppError');
const logger = require('../core/logger');
const metrics = require('../observability/metrics');

const uploadService = {
  async uploadAvatar(userId, file) {
    if (!file) {
      metrics.recordUploadFailure();
      throw new ValidationError('No image file provided', [{ field: 'image', message: 'No image file provided' }]);
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      metrics.recordUploadFailure();
      throw new NotFoundError('User not found');
    }

    try {
      const previousAvatar = user.avatar;
      const result = await storage.upload(file, 'avatars');
      await userRepository.updateById(userId, { avatar: result.url });

      if (previousAvatar && previousAvatar !== result.url && previousAvatar.startsWith('/uploads/avatars/')) {
        await storage.delete(previousAvatar);
      }

      metrics.recordUploadSuccess();
      logger.info({ userId, url: result.url }, 'Avatar uploaded');
      return { url: result.url };
    } catch (error) {
      metrics.recordUploadFailure();
      throw error;
    }
  },

  async uploadPostImage(file) {
    if (!file) {
      metrics.recordUploadFailure();
      throw new ValidationError('No image file provided', [{ field: 'image', message: 'No image file provided' }]);
    }
    try {
      const result = await storage.upload(file, 'posts');
      metrics.recordUploadSuccess();
      logger.info({ url: result.url }, 'Post image uploaded');
      return { url: result.url };
    } catch (error) {
      metrics.recordUploadFailure();
      throw error;
    }
  },
};

module.exports = uploadService;
