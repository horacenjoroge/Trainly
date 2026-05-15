const sharp = require('sharp');
const path = require('path');
const logger = require('../../core/logger');

const imageProcessor = {
  async resizeAvatar(buffer, size = 256) {
    try {
      return await sharp(buffer).resize(size, size, { fit: 'cover', position: 'center' }).jpeg({ quality: 85 }).toBuffer();
    } catch (err) {
      logger.error({ err }, 'Avatar resize failed, using original');
      return buffer;
    }
  },

  async resizePostImage(buffer, maxWidth = 1200) {
    try {
      const meta = await sharp(buffer).metadata();
      if (meta.width > maxWidth) {
        return await sharp(buffer).resize(maxWidth, null, { fit: 'inside' }).jpeg({ quality: 80 }).toBuffer();
      }
      return buffer;
    } catch (err) {
      logger.error({ err }, 'Post image resize failed');
      return buffer;
    }
  },

  async getMetadata(buffer) {
    try { return await sharp(buffer).metadata(); } catch { return null; }
  },
};
module.exports = imageProcessor;
