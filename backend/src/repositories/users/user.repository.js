const User = require('../../../models/user');

const userRepository = {
  findById: (id, select) => User.findById(id).select(select),
  findOne: (query) => User.findOne(query),
  create: (data) => new User(data).save(),
  updateById: (id, data) => User.findByIdAndUpdate(id, data, { new: true }),
  updateStats: (userId, stats) => User.findByIdAndUpdate(userId, { $set: { stats } }, { new: true }),
  search: (query, page = 1, limit = 20) => User.find({ name: { $regex: query, $options: 'i' } }).limit(limit).skip((page - 1) * limit),
  count: (query) => User.countDocuments(query),
};
module.exports = userRepository;
