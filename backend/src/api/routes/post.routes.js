const { Router } = require('express');
const postController = require('../controllers/post.controller');
const { authMiddleware, optionalAuth } = require('../../middleware/auth');
const { validateRequest } = require('../validators');
const { createPostSchema, listPostsQuery, postCommentSchema, postIdParamSchema } = require('../validators/post.validator');

const router = Router();
router.get('/', optionalAuth, validateRequest({ query: listPostsQuery }), postController.list);
router.post('/', authMiddleware, validateRequest({ body: createPostSchema }), postController.create);
router.put('/:id/like', authMiddleware, validateRequest({ params: postIdParamSchema }), postController.like);
router.post('/:id/comments', authMiddleware, validateRequest({ params: postIdParamSchema, body: postCommentSchema }), postController.addComment);
router.get('/:id/comments', authMiddleware, validateRequest({ params: postIdParamSchema }), postController.getComments);

module.exports = router;
