const { workoutService, getUserId } = require('../../services/workout.service');
const gpsService = require('../../services/gps.service');
const asyncHandler = require('../../middleware/asyncHandler');

const workoutController = {
  create: asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const data = req.validated || req.body;

    if (data.running?.route?.gpsPoints) {
      const validation = gpsService.validateRoute(data.running.route.gpsPoints);
      if (!validation.valid) return res.status(400).json({ status: 'error', message: validation.message });
    }

    const workout = await workoutService.create(userId, data);
    res.status(201).json({ status: 'success', data: { workout } });
  }),

  list: asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const workouts = await workoutService.getWorkouts(userId, req.query);
    res.json({ status: 'success', data: workouts });
  }),

  get: asyncHandler(async (req, res) => {
    const workout = await workoutService.getWorkout(req.params.id);
    res.json({ status: 'success', data: workout });
  }),

  update: asyncHandler(async (req, res) => {
    const workout = await workoutService.updateWorkout(req.params.id, req.body);
    res.json({ status: 'success', data: workout });
  }),

  delete: asyncHandler(async (req, res) => {
    await workoutService.deleteWorkout(req.params.id);
    res.json({ status: 'success', message: 'Workout deleted' });
  }),

  stats: asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const stats = await workoutService.getStats(userId, req.query.period || 'month');
    res.json({ status: 'success', data: stats.summary, trends: [], stats: [] });
  }),

  publicFeed: asyncHandler(async (req, res) => {
    const feed = await workoutService.getPublicFeed(req.query.page, req.query.limit);
    res.json({ status: 'success', data: feed });
  }),

  toggleLike: asyncHandler(async (req, res) => {
    const workout = await workoutService.getWorkout(req.params.id);
    const userId = getUserId(req);
    if (!workout.likes) workout.likes = [];
    const idx = workout.likes.indexOf(userId);
    if (idx > -1) workout.likes.splice(idx, 1); else workout.likes.push(userId);
    await workout.save();
    res.json({ status: 'success', data: workout });
  }),

  addComment: asyncHandler(async (req, res) => {
    const workout = await workoutService.getWorkout(req.params.id);
    if (!workout.comments) workout.comments = [];
    workout.comments.push({ user: getUserId(req), text: req.body.text, date: new Date() });
    await workout.save();
    res.json({ status: 'success', data: workout });
  }),
};

module.exports = workoutController;
