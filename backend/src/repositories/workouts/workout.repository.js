const Workout = require('../../../models/workout');

const workoutRepository = {
  findById: (id) => Workout.findById(id),
  findByUserId: (userId, query = {}, page = 1, limit = 20) => {
    const filter = { userId };
    if (query.type) filter.type = query.type;
    if (query.startDate || query.endDate) {
      filter.startTime = {};
      if (query.startDate) filter.startTime.$gte = new Date(query.startDate);
      if (query.endDate) filter.startTime.$lte = new Date(query.endDate);
    }
    return Workout.find(filter).sort({ [query.sortBy || 'startTime']: query.sortOrder === 'asc' ? 1 : -1 }).limit(limit).skip((page - 1) * limit);
  },
  create: (data) => new Workout(data).save(),
  update: (id, data) => Workout.findByIdAndUpdate(id, data, { new: true }),
  delete: (id) => Workout.findByIdAndDelete(id),
  countByUser: (userId) => Workout.countDocuments({ userId }),
  aggregate: (pipeline) => Workout.aggregate(pipeline),
  findPublic: (page = 1, limit = 20) => Workout.find({ privacy: 'public' }).populate('userId', 'name avatar').sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit),
  getStats: (userId, period = 'month') => Workout.aggregate([
    { $match: { userId: userId } },
    { $group: { _id: null, totalWorkouts: { $sum: 1 }, totalDuration: { $sum: '$duration' }, totalDistance: { $sum: { $add: ['$running.distance', '$cycling.distance', '$swimming.distance'] } }, totalCalories: { $sum: '$calories' } } }
  ]),
};
module.exports = workoutRepository;
