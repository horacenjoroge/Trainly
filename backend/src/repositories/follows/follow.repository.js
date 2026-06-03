const Follower = require('../../../models/Follower');

const followRepository = {
  findRelationship: (follower, following) => Follower.findOne({ follower, following }),
  create: (data) => new Follower(data).save(),
  deleteRelationship: (follower, following) => Follower.findOneAndDelete({ follower, following }),
  findFollowers: (userId) => Follower.find({ following: userId }).populate('follower', 'name avatar'),
  findFollowing: (userId) => Follower.find({ follower: userId }).populate('following', 'name avatar'),
  countFollowers: (userId) => Follower.countDocuments({ following: userId }),
  countFollowing: (userId) => Follower.countDocuments({ follower: userId }),
};

module.exports = followRepository;
