const { z } = require('zod');

const createWorkoutSchema = z.object({
  sessionId: z.string().min(1),
  type: z.enum(['Running', 'Cycling', 'Swimming', 'Gym', 'Walking', 'Hiking']),
  name: z.string().max(100).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  duration: z.number().min(0),
  calories: z.number().min(0).optional(),
  distance: z.number().min(0).optional(),
  notes: z.string().max(1000).optional(),
  privacy: z.enum(['public', 'friends', 'private']).optional(),
  running: z.any().optional(),
  cycling: z.any().optional(),
  swimming: z.any().optional(),
  gym: z.any().optional(),
}).passthrough();

const paginationQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

module.exports = { createWorkoutSchema, paginationQuery };
