const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { authMiddleware } = require('../../middleware/auth');
const { validate } = require('../../api/validators/auth.validator');
const { loginSchema, registerSchema } = require('../../api/validators/auth.validator');

const router = Router();
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.get('/user', authMiddleware, authController.getCurrentUser);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
