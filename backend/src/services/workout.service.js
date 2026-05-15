const mongoose = require('mongoose');
const workoutRepository = require('../repositories/workouts/workout.repository');
const userRepository = require('../repositories/users/user.repository');
const emitter = require('../events/emitter');
const { NotFoundError } = require('../core/errors/AppError');
const logger = require('../core/logger');

const workoutService = {
  async create(userId, data) {
    const workoutData = { ...data, userId };
    const workout = await workoutRepository.create(workoutData);
    const user = await userRepository.findById(userId);
    logger.info({ userId, workoutId: workout._id }, 'Workout created');
    emitter.emit('WorkoutCreated', { userId, workout: workout.toObject(), user });
    return workout;
  },

  async getWorkouts(userId, query) {
    const { page = 1, limit = 20, type, startDate, endDate, sortBy = 'startTime', sortOrder = 'desc' } = query;
    return workoutRepository.findByUserId(userId, { type, startDate, endDate, sortBy, sortOrder }, parseInt(page), parseInt(limit));
  },

  async getWorkout(id) {
    const workout = await workoutRepository.findById(id);
    if (!workout) throw new NotFoundError('Workout not found');
    return workout;
  },

  async updateWorkout(id, data) {
    const workout = await workoutRepository.update(id, data);
    if (!workout) throw new NotFoundError('Workout not found');
    return workout;
  },

  async deleteWorkout(id) {
    const workout = await workoutRepository.delete(id);
    if (!workout) throw new NotFoundError('Workout not found');
    return workout;
  },

  async getStats(userId, period = 'month') {
    const stats = await workoutRepository.getStats(userId, period);
    const totalWorkouts = await workoutRepository.countByUser(userId);
    return { summary: stats[0] || { totalWorkouts, totalDuration: 0, totalDistance: 0, totalCalories: 0 }, totalWorkouts };
  },

  async getPublicFeed(page = 1, limit = 20) {
    return workoutRepository.findPublic(parseInt(page), parseInt(limit));
  }
};

function getUserId(req) {
  if (req.user.id) return req.user.id;
  if (req.user.userId) return req.user.userId;
  if (req.user._id) return req.user._id;
  return req.user;
}

module.exports = { workoutService, getUserId };
