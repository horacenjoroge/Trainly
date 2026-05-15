const achievementService = require('../../services/achievement.service');
const asyncHandler = require('../../middleware/asyncHandler');

const achievementController = {
  getUserAchievements: asyncHandler(async (req, res) => {
    const result = await achievementService.getUserAchievements(req.user.id, req.query);
    res.json({ status: 'success', ...result });
  }),

  getLeaderboard: asyncHandler(async (req, res) => {
    const leaderboard = await achievementService.getLeaderboard(req.query.limit || 50);
    res.json({ status: 'success', data: leaderboard });
  }),

  getProgress: asyncHandler(async (req, res) => {
    const progress = await achievementService.getUserAchievements(req.user.id, {});
    res.json({ status: 'success', data: progress });
  }),
};

module.exports = achievementController;
