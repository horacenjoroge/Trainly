const multer = require('multer');
const { AppError } = require('../core/errors/AppError');

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) return cb(null, true);
    return cb(new AppError('Only image uploads are allowed', 400, 'INVALID_UPLOAD_TYPE'));
  },
});

module.exports = {
  imageUpload,
};
