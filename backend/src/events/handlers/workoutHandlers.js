const emitter = require('../emitter');
const logger = require('../../core/logger');

function registerWorkoutHandlers() {
  emitter.on('WorkoutCreated', async ({ userId, workout, user }) => {
    logger.info({ userId, workoutId: workout._id }, 'WorkoutCreated handler: updating stats');
    try {
      if (user && typeof user.updateWorkoutStats === 'function') {
        const workoutData = workout.toObject ? workout.toObject() : workout;
        user.updateWorkoutStats(workoutData);
        await user.save();
      }
    } catch (err) {
      logger.error({ err, userId }, 'Failed to update user stats after workout');
    }
  });

  emitter.on('WorkoutCreated', async ({ userId, workout }) => {
    logger.info({ userId, workoutId: workout._id }, 'WorkoutCreated handler: checking achievements');
    try {
      const { checkAndCreateAchievements } = require('../../services/achievement.service');
      await checkAndCreateAchievements(userId, workout);
    } catch (err) {
      logger.error({ err, userId }, 'Failed to check achievements after workout');
    }
  });

  emitter.on('WorkoutCreated', async ({ userId, workout }) => {
    const config = require('../../core/config');
    if (config.NODE_ENV !== 'test') {
      logger.debug({ userId, workoutId: workout._id }, 'WorkoutCreated handler: feed notification (stub)');
    }
  });
}

module.exports = { registerWorkoutHandlers };
