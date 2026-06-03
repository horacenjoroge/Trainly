const { z } = require('zod');

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
});

const updateStatsSchema = z.record(z.any());

const userSearchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
});

const userSearchParamSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
});

const userIdParamSchema = z.object({
  id: z.string().min(1, 'User id is required'),
});

const followUserParamSchema = z.object({
  userId: z.string().min(1, 'User id is required'),
});

const socialUserQuerySchema = z.object({
  userId: z.string().min(1).optional(),
});

module.exports = {
  updateProfileSchema,
  updateStatsSchema,
  userSearchQuerySchema,
  userSearchParamSchema,
  userIdParamSchema,
  followUserParamSchema,
  socialUserQuerySchema,
};
