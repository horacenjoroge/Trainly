const logger = require('../../core/logger');
module.exports = {
  async upload(file, subDir = 'avatars') {
    logger.warn('S3 adapter not implemented, falling back to local');
    return require('./local.adapter').upload(file, subDir);
  },
  async delete(url) { logger.warn('S3 adapter not implemented'); },
  getUrl(filename, subDir) { return `/uploads/${subDir}/${filename}`; }
};
