const { z } = require('zod');

const createPostSchema = z.object({
  content: z.string().min(1, 'Post content is required').max(5000),
  image: z.string().optional().nullable(),
  privacy: z.enum(['public', 'friends', 'private']).optional(),
  workoutDetails: z.object({
    type: z.string().optional(),
    duration: z.coerce.number().min(0).optional(),
    calories: z.coerce.number().min(0).optional(),
  }).partial().optional().nullable(),
});

const listPostsQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

const postIdParamSchema = z.object({
  id: z.string().min(1, 'Post id is required'),
});

const postCommentSchema = z.object({
  text: z.string().min(1, 'Comment text is required').max(1000),
});

module.exports = {
  createPostSchema,
  listPostsQuery,
  postIdParamSchema,
  postCommentSchema,
};
