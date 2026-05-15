const Achievement = require('../../../models/Achievement');

const achievementRepository = {
  findByUser: (userId, query = {}, page = 1, limit = 20) => {
    const filter = { user: userId };
    if (query.category) filter.category = query.category;
    return Achievement.find(filter).sort({ [query.sortBy || 'createdAt']: -1 }).limit(limit).skip((page - 1) * limit).populate('workoutId', 'type startTime duration').populate('user', 'name avatar');
  },
  countByUser: (userId, query = {}) => Achievement.countDocuments({ user: userId, ...query }),
  create: (data) => new Achievement(data).save(),
  findEarned: (userId, type) => Achievement.findOne({ user: userId, type }),
  getTemplates: () => Achievement.getAchievementTemplates(),
  getLeaderboard: (limit = 50) => Achievement.aggregate([
    { $group: { _id: '$user', totalPoints: { $sum: '$points' }, achievements: { $sum: 1 } } },
    { $sort: { totalPoints: -1 } }, { $limit: limit },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.password': 0, 'user.email': 0 } }
  ]),
};
module.exports = achievementRepository;
