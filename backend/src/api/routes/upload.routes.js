const { Router } = require('express');
const asyncHandler = require('../../middleware/asyncHandler');
const { authMiddleware } = require('../../middleware/auth');
const storage = require('../../infrastructure/storage');

const router = Router();
router.use(authMiddleware);

router.post('/avatar', asyncHandler(async (req, res) => {
  if (!req.files || !req.files.image) return res.status(400).json({ message: 'No image file provided' });
  const result = await storage.upload(req.files.image, 'avatars');
  const userRepository = require('../../repositories/users/user.repository');
  await userRepository.updateById(req.user.id, { avatar: result.url });
  res.json({ url: result.url });
}));

router.post('/post', asyncHandler(async (req, res) => {
  if (!req.files || !req.files.image) return res.status(400).json({ message: 'No image file provided' });
  const result = await storage.upload(req.files.image, 'posts');
  res.json({ url: result.url });
}));

module.exports = router;
