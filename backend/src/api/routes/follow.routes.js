const { Router } = require('express');
const asyncHandler = require('../../middleware/asyncHandler');
const { authMiddleware } = require('../../middleware/auth');
const Follower = require('../../../models/Follower');
const User = require('../../../models/user');

const router = Router();
router.use(authMiddleware);

router.post('/:userId', asyncHandler(async (req, res) => {
  if (req.user.id === req.params.userId) return res.status(400).json({ message: 'Cannot follow self' });
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const existing = await Follower.findOne({ follower: req.user.id, following: req.params.userId });
  if (existing) return res.status(400).json({ message: 'Already following' });
  await new Follower({ follower: req.user.id, following: req.params.userId }).save();
  res.json({ message: 'Followed' });
}));

router.delete('/:userId', asyncHandler(async (req, res) => {
  const result = await Follower.findOneAndDelete({ follower: req.user.id, following: req.params.userId });
  if (!result) return res.status(400).json({ message: 'Not following' });
  res.json({ message: 'Unfollowed' });
}));

router.get('/followers', asyncHandler(async (req, res) => {
  const follows = await Follower.find({ following: req.query.userId || req.user.id }).populate('follower', 'name avatar');
  res.json(follows.map(f => f.follower));
}));

router.get('/following', asyncHandler(async (req, res) => {
  const follows = await Follower.find({ follower: req.query.userId || req.user.id }).populate('following', 'name avatar');
  res.json(follows.map(f => f.following));
}));

module.exports = router;
