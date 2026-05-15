const { Router } = require('express');
const postController = require('../controllers/post.controller');
const { authMiddleware, optionalAuth } = require('../../middleware/auth');

const router = Router();
router.get('/', optionalAuth, postController.list);
router.post('/', authMiddleware, postController.create);
router.put('/:id/like', authMiddleware, postController.like);
router.post('/:id/comments', authMiddleware, postController.addComment);
router.get('/:id/comments', authMiddleware, postController.getComments);

module.exports = router;
