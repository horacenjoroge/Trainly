const workoutRepository = require('../repositories/workouts/workout.repository');
const postRepository = require('../repositories/posts/post.repository');
const logger = require('../core/logger');

const feedService = {
  async getPublicFeed(page = 1, limit = 20) {
    return workoutRepository.findPublic(parseInt(page), parseInt(limit));
  },

  async getCommunityFeed(page = 1, limit = 20) {
    return postRepository.findAll(parseInt(page), parseInt(limit));
  },

  async createPostFromWorkout(userId, workout, content) {
    const post = await postRepository.create({
      user: userId,
      content: content || `Just completed a ${workout.type} workout!`,
      workoutDetails: { type: workout.type, duration: workout.duration, calories: workout.calories },
    });
    logger.info({ userId, postId: post._id }, 'Post created from workout');
    return post;
  },
};
module.exports = feedService;
