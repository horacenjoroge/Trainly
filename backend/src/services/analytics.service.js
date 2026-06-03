const workoutRepository = require('../repositories/workouts/workout.repository');
const logger = require('../core/logger');

const analyticsService = {
  async getTrends(userId, days = 7) {
    const now = new Date();
    const start = new Date(now.getTime() - days * 86400000);
    const trends = await workoutRepository.aggregate([
      { $match: { userId: userId, startTime: { $gte: start } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } }, count: { $sum: 1 }, totalCalories: { $sum: '$calories' }, totalDuration: { $sum: '$duration' } } },
      { $sort: { _id: 1 } },
    ]);
    return trends;
  },

  async getMonthlyReport(userId, year, month) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    const workouts = await workoutRepository.findByUserId(userId, { startDate: start.toISOString(), endDate: end.toISOString() }, 1, 1000);
    const total = workouts.reduce((acc, w) => ({
      workouts: acc.workouts + 1,
      duration: acc.duration + (w.duration || 0),
      calories: acc.calories + (w.calories || 0),
      distance: acc.distance + (w.running?.distance || w.cycling?.distance || w.swimming?.distance || 0),
    }), { workouts: 0, duration: 0, calories: 0, distance: 0 });
    return { period: { year, month }, ...total };
  },
};
module.exports = analyticsService;
