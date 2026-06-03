const postRepository = require('../repositories/posts/post.repository');
const { NotFoundError } = require('../core/errors/AppError');
const logger = require('../core/logger');

const postService = {
  async listPosts(query = {}) {
    const { page = 1, limit = 20 } = query;
    return postRepository.findAll(page, limit);
  },

  async createPost(userId, data) {
    const post = await postRepository.create({ user: userId, ...data });
    logger.info({ userId, postId: post._id }, 'Post created');
    return post;
  },

  async toggleLike(postId, userId) {
    const post = await postRepository.findById(postId);
    if (!post) throw new NotFoundError('Post not found');

    const isLiked = post.likes.some((like) => like.toString() === userId.toString());
    const updated = isLiked
      ? await postRepository.removeLike(postId, userId)
      : await postRepository.addLike(postId, userId);

    logger.info({ userId, postId, liked: !isLiked }, 'Post like toggled');
    return updated;
  },

  async addComment(postId, userId, text) {
    const comment = { user: userId, text, date: new Date() };
    const updated = await postRepository.addComment(postId, comment);
    if (!updated) throw new NotFoundError('Post not found');

    logger.info({ userId, postId }, 'Post comment added');
    return updated.comments[updated.comments.length - 1];
  },

  async getComments(postId) {
    const post = await postRepository.findById(postId);
    if (!post) throw new NotFoundError('Post not found');
    return post.comments || [];
  },
};

module.exports = postService;
