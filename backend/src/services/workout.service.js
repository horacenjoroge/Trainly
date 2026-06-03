const mongoose = require('mongoose');
const workoutRepository = require('../repositories/workouts/workout.repository');
const userRepository = require('../repositories/users/user.repository');
const emitter = require('../events/emitter');
const { NotFoundError } = require('../core/errors/AppError');
const logger = require('../core/logger');

const workoutService = {
  async create(userId, data) {
    const workoutData = normalizeWorkoutData(userId, data);
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
  },

  async toggleLike(id, userId) {
    const workout = await this.getWorkout(id);
    if (!workout.likes) workout.likes = [];
    const index = workout.likes.findIndex((like) => like.toString() === userId.toString());

    if (index > -1) workout.likes.splice(index, 1);
    else workout.likes.push(userId);

    await workout.save();
    logger.info({ userId, workoutId: id, liked: index === -1 }, 'Workout like toggled');
    return workout;
  },

  async addComment(id, userId, text) {
    const workout = await this.getWorkout(id);
    if (!workout.comments) workout.comments = [];
    workout.comments.push({ user: userId, text, date: new Date() });
    await workout.save();
    logger.info({ userId, workoutId: id }, 'Workout comment added');
    return workout;
  },
};

function getUserId(req) {
  if (req.user.id) return req.user.id;
  if (req.user.userId) return req.user.userId;
  if (req.user._id) return req.user._id;
  return req.user;
}

function normalizeWorkoutData(userId, data = {}) {
  const duration = Number(data.duration || 0);
  const endTime = data.endTime ? new Date(data.endTime) : new Date();
  const startTime = data.startTime ? new Date(data.startTime) : new Date(endTime.getTime() - (duration * 1000));
  const workoutData = {
    ...data,
    userId,
    duration,
    calories: Number(data.calories || 0),
    startTime,
    endTime,
  };

  if (!workoutData.sessionId) {
    workoutData.sessionId = `${String(data.type || 'workout').toLowerCase()}_${Date.now()}`;
  }

  const distance = Number(data.distance || 0);
  switch (data.type) {
    case 'Running':
      workoutData.running = { ...(data.running || {}), distance: data.running?.distance ?? distance };
      break;
    case 'Cycling':
      workoutData.cycling = { ...(data.cycling || {}), distance: data.cycling?.distance ?? distance };
      break;
    case 'Swimming':
      workoutData.swimming = { ...(data.swimming || {}), distance: data.swimming?.distance ?? distance };
      break;
    default:
      break;
  }

  return workoutData;
}

module.exports = { workoutService, getUserId, normalizeWorkoutData };
