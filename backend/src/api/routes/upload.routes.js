const { Router } = require('express');
const { authMiddleware } = require('../../middleware/auth');
const uploadController = require('../controllers/upload.controller');
const { imageUpload } = require('../../middleware/upload');

const router = Router();
router.use(authMiddleware);

router.post('/avatar', imageUpload.single('image'), uploadController.uploadAvatar);
router.post('/post', imageUpload.single('image'), uploadController.uploadPostImage);

module.exports = router;
