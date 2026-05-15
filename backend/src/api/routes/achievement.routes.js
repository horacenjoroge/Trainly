const { Router } = require('express');
const achievementController = require('../controllers/achievement.controller');
const { authMiddleware } = require('../../middleware/auth');

const router = Router();
router.use(authMiddleware);
router.get('/', achievementController.getUserAchievements);
router.get('/progress', achievementController.getProgress);
router.get('/leaderboard', achievementController.getLeaderboard);

module.exports = router;
