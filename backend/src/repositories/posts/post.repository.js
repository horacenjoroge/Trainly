const Post = require('../../../models/post');

const postRepository = {
  findAll: (page = 1, limit = 20) => Post.find().sort({ createdAt: -1 }).populate('user', 'name avatar').limit(limit).skip((page - 1) * limit).lean(),
  findById: (id) => Post.findById(id).populate('user', 'name avatar').populate('comments.user', 'name avatar'),
  create: (data) => new Post(data).save(),
  addLike: (postId, userId) => Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true }),
  removeLike: (postId, userId) => Post.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true }),
  addComment: (postId, comment) => Post.findByIdAndUpdate(postId, { $push: { comments: comment } }, { new: true }).populate('comments.user', 'name avatar'),
  count: () => Post.countDocuments(),
};
module.exports = postRepository;
