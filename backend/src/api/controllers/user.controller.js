const asyncHandler = require('../../middleware/asyncHandler');
const userService = require('../../services/user.service');
const followService = require('../../services/follow.service');
const achievementService = require('../../services/achievement.service');

const userController = {
  getProfile: asyncHandler(async (req, res) => {
    const user = await userService.getProfile(req.user.id);
    res.json(user);
  }),

  getFullProfile: asyncHandler(async (req, res) => {
    const user = await userService.getFullProfile(req.user.id);
    res.json(user);
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const user = await userService.updateProfile(req.user.id, req.validated.body);
    res.json(user);
  }),

  updateStats: asyncHandler(async (req, res) => {
    const stats = await userService.updateStats(req.user.id, req.validated.body);
    res.json(stats);
  }),

  search: asyncHandler(async (req, res) => {
    const users = await userService.searchUsers(req.validated.query?.q || req.validated.params?.query);
    res.json(users);
  }),

  getById: asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.validated.params.id || req.validated.params.userId);
    res.json(user);
  }),

  getFollowers: asyncHandler(async (req, res) => {
    const users = await followService.getFollowers(req.validated.query.userId || req.user.id);
    res.json(users);
  }),

  getFollowing: asyncHandler(async (req, res) => {
    const users = await followService.getFollowing(req.validated.query.userId || req.user.id);
    res.json(users);
  }),

  followUser: asyncHandler(async (req, res) => {
    const result = await followService.followUser(req.user.id, req.validated.params.userId);
    res.json(result);
  }),

  unfollowUser: asyncHandler(async (req, res) => {
    const result = await followService.unfollowUser(req.user.id, req.validated.params.userId);
    res.json(result);
  }),

  getAchievements: asyncHandler(async (req, res) => {
    const result = await achievementService.getUserAchievements(req.user.id, req.validated.query || req.query);
    res.json({ status: 'success', ...result });
  }),
};

module.exports = userController;
