const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../../middleware/auth');
const { validateRequest } = require('../validators');
const { loginSchema, logoutSchema, refreshSchema, registerSchema } = require('../validators/auth.validator');

const router = Router();
router.post('/register', validateRequest({ body: registerSchema }), authController.register);
router.post('/login', validateRequest({ body: loginSchema }), authController.login);
router.post('/refresh', validateRequest({ body: refreshSchema }), authController.refreshToken);
router.get('/user', authMiddleware, authController.getCurrentUser);
router.post('/logout', authMiddleware, validateRequest({ body: logoutSchema }), authController.logout);

module.exports = router;
