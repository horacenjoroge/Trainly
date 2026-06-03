const { z } = require('zod');

const followUserParamSchema = z.object({
  userId: z.string().min(1, 'User id is required'),
});

const followListQuerySchema = z.object({
  userId: z.string().min(1).optional(),
});

module.exports = {
  followUserParamSchema,
  followListQuerySchema,
};
