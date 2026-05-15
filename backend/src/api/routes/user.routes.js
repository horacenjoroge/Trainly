const { Router } = require('express');
const asyncHandler = require('../../middleware/asyncHandler');
const { authMiddleware } = require('../../middleware/auth');
const userRepository = require('../../repositories/users/user.repository');

const router = Router();
router.use(authMiddleware);

router.get('/profile', asyncHandler(async (req, res) => {
  const user = await userRepository.findById(req.user.id, '-password');
  res.json(user);
}));

router.put('/profile', asyncHandler(async (req, res) => {
  const allowed = ['name', 'bio', 'location'];
  const updates = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = k === 'bio' || k === 'location' ? { $set: { [`profile.${k}`]: req.body[k] } } : { $set: { [k]: req.body[k] } }; });
  const user = await userRepository.updateById(req.user.id, Object.assign({}, ...Object.values(updates)));
  res.json(user);
}));

router.put('/stats', asyncHandler(async (req, res) => {
  const user = await userRepository.updateById(req.user.id, { $set: { stats: req.body } });
  res.json(user);
}));

router.get('/search', asyncHandler(async (req, res) => {
  const users = req.query.q ? await userRepository.search(req.query.q) : [];
  res.json(users);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const user = await userRepository.findById(req.params.id, '-password -email');
  res.json(user);
}));

module.exports = router;
