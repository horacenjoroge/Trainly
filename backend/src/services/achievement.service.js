const achievementRepository = require('../repositories/achievements/achievement.repository');
const userRepository = require('../repositories/users/user.repository');
const logger = require('../core/logger');

const achievementService = {
  async getUserAchievements(userId, query) {
    const { page = 1, limit = 20, category, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const achievements = await achievementRepository.findByUser(userId, { category, sortBy, sortOrder }, parseInt(page), parseInt(limit));
    const total = await achievementRepository.countByUser(userId, { category });
    const stats = await this.getAchievementStats(userId);
    return { achievements, pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / limit), totalAchievements: total, hasNextPage: page < Math.ceil(total / limit) }, stats };
  },

  async getAchievementStats(userId) {
    const allAchievements = await achievementRepository.countByUser(userId);
    const totalPoints = await achievementRepository.findByUser(userId);
    return { total: allAchievements, points: totalPoints.reduce((sum, a) => sum + (a.points || 0), 0) };
  },

  async checkAndCreateAchievements(userId, workout) {
    const newAchievements = [];
    const user = await userRepository.findById(userId);
    if (!user) return newAchievements;

    const templates = achievementRepository.getTemplates();
    const totalWorkouts = await achievementRepository.countByUser(userId) + 1;
    const workoutData = workout.toObject ? workout.toObject() : workout;

    const milestoneChecks = [
      { type: 'first_workout', condition: totalWorkouts === 1 },
      { type: 'workouts_10', condition: totalWorkouts === 10 },
      { type: 'workouts_50', condition: totalWorkouts === 50 },
      { type: 'workouts_100', condition: totalWorkouts === 100 },
    ];

    for (const check of milestoneChecks) {
      if (check.condition && templates[check.type]) {
        const existing = await achievementRepository.findEarned(userId, check.type);
        if (!existing) {
          const tmpl = templates[check.type];
          const ach = await achievementRepository.create({
            user: userId, title: tmpl.title, emoji: tmpl.emoji, type: check.type,
            description: tmpl.description, category: tmpl.category, rarity: tmpl.rarity,
            points: tmpl.points, progress: { current: totalWorkouts, target: check.type === 'first_workout' ? 1 : parseInt(check.type.split('_')[1]), percentage: 100 },
            workoutId: workoutData._id, workoutType: workoutData.type,
          });
          newAchievements.push(ach);
        }
      }
    }

    if (newAchievements.length > 0) logger.info({ userId, achievements: newAchievements.map(a => a.type) }, 'New achievements earned');
    return newAchievements;
  },

  async getLeaderboard(limit = 50) { return achievementRepository.getLeaderboard(limit); },
};

module.exports = achievementService;
