const asyncHandler = require('../../middleware/asyncHandler');
const followService = require('../../services/follow.service');

const followController = {
  followUser: asyncHandler(async (req, res) => {
    const result = await followService.followUser(req.user.id, req.validated.params.userId);
    res.json(result);
  }),

  unfollowUser: asyncHandler(async (req, res) => {
    const result = await followService.unfollowUser(req.user.id, req.validated.params.userId);
    res.json(result);
  }),

  getFollowers: asyncHandler(async (req, res) => {
    const result = await followService.getFollowers(req.validated.query.userId || req.user.id);
    res.json(result);
  }),

  getFollowing: asyncHandler(async (req, res) => {
    const result = await followService.getFollowing(req.validated.query.userId || req.user.id);
    res.json(result);
  }),
};

module.exports = followController;
