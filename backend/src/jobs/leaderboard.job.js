const logger = require('../core/logger');
const achievementService = require('../services/achievement.service');

const leaderboardJob = {
  async recalculate() {
    logger.info('Leaderboard recalculation started');
    try {
      const leaderboard = await achievementService.getLeaderboard(100);
      const cache = require('../infrastructure/cache');
      await cache.set('leaderboard:global', JSON.stringify(leaderboard), 3600);
      logger.info({ count: leaderboard.length }, 'Leaderboard cached');
    } catch (err) {
      logger.error({ err }, 'Leaderboard recalculation failed');
    }
  },
};
module.exports = leaderboardJob;
