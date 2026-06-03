const { workoutService, getUserId } = require('../../services/workout.service');
const gpsService = require('../../services/gps.service');
const asyncHandler = require('../../middleware/asyncHandler');
const { ValidationError } = require('../../core/errors/AppError');

const workoutController = {
  create: asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const data = req.validated.body;

    if (data.running?.route?.gpsPoints) {
      const validation = gpsService.validateRoute(data.running.route.gpsPoints);
      if (!validation.valid) throw new ValidationError(validation.message, [{ field: 'running.route.gpsPoints', message: validation.message }]);
    }

    const workout = await workoutService.create(userId, data);
    res.status(201).json({ status: 'success', data: { workout } });
  }),

  list: asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const workouts = await workoutService.getWorkouts(userId, req.validated.query);
    res.json({ status: 'success', data: workouts });
  }),

  get: asyncHandler(async (req, res) => {
    const workout = await workoutService.getWorkout(req.validated.params.id);
    res.json({ status: 'success', data: workout });
  }),

  update: asyncHandler(async (req, res) => {
    const workout = await workoutService.updateWorkout(req.validated.params.id, req.validated.body);
    res.json({ status: 'success', data: workout });
  }),

  delete: asyncHandler(async (req, res) => {
    await workoutService.deleteWorkout(req.validated.params.id);
    res.json({ status: 'success', message: 'Workout deleted' });
  }),

  stats: asyncHandler(async (req, res) => {
    const userId = getUserId(req);
    const stats = await workoutService.getStats(userId, req.validated.query.period || 'month');
    res.json({ status: 'success', data: stats.summary, trends: [], stats: [] });
  }),

  publicFeed: asyncHandler(async (req, res) => {
    const feed = await workoutService.getPublicFeed(req.validated.query.page, req.validated.query.limit);
    res.json({ status: 'success', data: feed });
  }),

  toggleLike: asyncHandler(async (req, res) => {
    const workout = await workoutService.toggleLike(req.validated.params.id, getUserId(req));
    res.json({ status: 'success', data: workout });
  }),

  addComment: asyncHandler(async (req, res) => {
    const workout = await workoutService.addComment(req.validated.params.id, getUserId(req), req.validated.body.text);
    res.json({ status: 'success', data: workout });
  }),
};

module.exports = workoutController;
