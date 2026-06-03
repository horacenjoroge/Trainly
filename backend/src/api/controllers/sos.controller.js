const sosService = require('../../services/sos.service');
const asyncHandler = require('../../middleware/asyncHandler');
const { sosLimiter } = require('../../middleware/security');

const sosController = {
  sendSOS: [sosLimiter, asyncHandler(async (req, res) => {
    const result = await sosService.sendSOS(req.user.id, req.validated.body.location, req.validated.body.message);
    res.json(result);
  })],
};

module.exports = sosController;
