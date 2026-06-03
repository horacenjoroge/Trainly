const { z } = require('zod');

const achievementListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  category: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

const leaderboardQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

module.exports = {
  achievementListQuerySchema,
  leaderboardQuerySchema,
};
