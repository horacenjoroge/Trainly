const workoutRepository = require('../repositories/workouts/workout.repository');
const logger = require('../core/logger');

const statsService = {
  async getSummary(userId, period = 'month') {
    const stats = await workoutRepository.getStats(userId, period);
    const total = await workoutRepository.countByUser(userId);
    return { summary: stats[0] || { totalWorkouts: total, totalDuration: 0, totalDistance: 0, totalCalories: 0 }, totalWorkouts: total };
  },

  async getActivityBreakdown(userId) {
    const breakdown = await workoutRepository.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$type', count: { $sum: 1 }, totalDuration: { $sum: '$duration' }, totalDistance: { $sum: { $add: ['$running.distance', '$cycling.distance', '$swimming.distance'] } } } },
    ]);
    return breakdown;
  },

  async getPersonalBests(userId) {
    const types = ['Running', 'Cycling', 'Swimming', 'Gym'];
    const bests = {};
    for (const type of types) {
      const workouts = await workoutRepository.findByUserId(userId, { type }, 1, 100);
      if (workouts.length > 0) {
        bests[type] = {
          longestDuration: Math.max(...workouts.map(w => w.duration || 0)),
          longestDistance: Math.max(...workouts.map(w => w.running?.distance || w.cycling?.distance || w.swimming?.distance || 0)),
          mostCalories: Math.max(...workouts.map(w => w.calories || 0)),
        };
      }
    }
    return bests;
  },

  async updateUserStats(user, workoutData) {
    if (user && typeof user.updateWorkoutStats === 'function') {
      user.updateWorkoutStats(workoutData);
      await user.save();
      logger.debug({ userId: user._id }, 'User stats updated after workout');
    }
  },
};
module.exports = statsService;
