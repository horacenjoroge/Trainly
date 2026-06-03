const { z } = require('zod');

const createWorkoutSchema = z.object({
  sessionId: z.string().min(1).optional(),
  type: z.enum(['Running', 'Cycling', 'Swimming', 'Gym', 'Walking', 'Hiking']),
  name: z.string().max(100).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  duration: z.coerce.number().min(0),
  calories: z.coerce.number().min(0).optional(),
  distance: z.coerce.number().min(0).optional(),
  notes: z.string().max(1000).optional(),
  privacy: z.enum(['public', 'friends', 'private']).optional(),
  running: z.any().optional(),
  cycling: z.any().optional(),
  swimming: z.any().optional(),
  gym: z.any().optional(),
}).passthrough();

const updateWorkoutSchema = createWorkoutSchema.partial();

const paginationQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  type: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

const statsQuery = z.object({
  period: z.enum(['week', 'month', 'year', 'all']).optional(),
});

const publicFeedQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

const idParamSchema = z.object({
  id: z.string().min(1, 'Workout id is required'),
});

const commentSchema = z.object({
  text: z.string().min(1, 'Comment text is required').max(1000),
});

module.exports = {
  createWorkoutSchema,
  updateWorkoutSchema,
  paginationQuery,
  statsQuery,
  publicFeedQuery,
  idParamSchema,
  commentSchema,
};
