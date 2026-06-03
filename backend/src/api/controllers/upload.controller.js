const asyncHandler = require('../../middleware/asyncHandler');
const uploadService = require('../../services/upload.service');

const uploadController = {
  uploadAvatar: asyncHandler(async (req, res) => {
    const result = await uploadService.uploadAvatar(req.user.id, req.file);
    res.json(result);
  }),

  uploadPostImage: asyncHandler(async (req, res) => {
    const result = await uploadService.uploadPostImage(req.file);
    res.json(result);
  }),
};

module.exports = uploadController;
