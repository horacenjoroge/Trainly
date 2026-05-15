const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../core/logger');
const imageProcessor = require('./imageProcessor');

const UPLOAD_BASE = path.join(__dirname, '../../../public/uploads');

const localAdapter = {
  async upload(file, subDir = 'avatars') {
    const dir = path.join(UPLOAD_BASE, subDir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `${subDir}-${uuidv4()}${ext}`;
    const filepath = path.join(dir, filename);

    let buffer = file.buffer;
    if (subDir === 'avatars') buffer = await imageProcessor.resizeAvatar(buffer);
    else if (subDir === 'posts') buffer = await imageProcessor.resizePostImage(buffer);

    fs.writeFileSync(filepath, buffer);
    const meta = await imageProcessor.getMetadata(buffer);
    logger.debug({ filename, subDir, width: meta?.width, height: meta?.height }, 'File saved');
    return { url: `/uploads/${subDir}/${filename}`, filename, path: filepath, meta };
  },

  async delete(url) {
    if (!url) return;
    const filepath = path.join(UPLOAD_BASE, url.replace('/uploads/', ''));
    try { fs.unlinkSync(filepath); logger.debug({ url }, 'File deleted'); }
    catch (_) { logger.warn({ url }, 'File not found for deletion'); }
  },

  getUrl(filename, subDir) { return `/uploads/${subDir}/${filename}`; },
};
module.exports = localAdapter;
