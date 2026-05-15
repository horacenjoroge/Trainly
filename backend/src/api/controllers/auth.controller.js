const authService = require('../../services/auth.service');
const asyncHandler = require('../../middleware/asyncHandler');

const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.validated);
    res.status(201).json(result);
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.validated);
    res.json(result);
  }),

  refreshToken: asyncHandler(async (req, res) => {
    const result = await authService.refreshToken(req.body.refreshToken);
    res.json(result);
  }),

  logout: asyncHandler(async (req, res) => {
    await authService.logout(req.user?.id, req.body.tokenJti);
    res.json({ message: 'Logged out successfully' });
  }),

  getCurrentUser: asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user.id);
    res.json(user);
  }),
};

module.exports = authController;
