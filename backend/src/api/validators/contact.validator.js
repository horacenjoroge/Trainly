const { z } = require('zod');

const contactBodySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  phoneNumber: z.string().min(1, 'Phone number is required').max(30),
  relationship: z.string().max(100).optional(),
});

const contactIdParamSchema = z.object({
  id: z.string().min(1, 'Contact id is required'),
});

const sosBodySchema = z.object({
  location: z.object({
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
  }).optional(),
  message: z.string().max(1000).optional(),
}).passthrough();

module.exports = {
  contactBodySchema,
  contactIdParamSchema,
  sosBodySchema,
};
