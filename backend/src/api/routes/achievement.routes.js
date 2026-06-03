const { Router } = require('express');
const achievementController = require('../controllers/achievement.controller');
const { authMiddleware } = require('../../middleware/auth');
const { validateRequest } = require('../validators');
const { achievementListQuerySchema, leaderboardQuerySchema } = require('../validators/achievement.validator');

const router = Router();
router.use(authMiddleware);
router.get('/', validateRequest({ query: achievementListQuerySchema }), achievementController.getUserAchievements);
router.get('/progress', achievementController.getProgress);
router.get('/leaderboard', validateRequest({ query: leaderboardQuerySchema }), achievementController.getLeaderboard);

module.exports = router;
