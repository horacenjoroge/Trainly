const { Router } = require('express');
const { authMiddleware } = require('../../middleware/auth');
const followController = require('../controllers/follow.controller');
const { validateRequest } = require('../validators');
const { followListQuerySchema, followUserParamSchema } = require('../validators/follow.validator');

const router = Router();
router.use(authMiddleware);

router.post('/:userId', validateRequest({ params: followUserParamSchema }), followController.followUser);
router.delete('/:userId', validateRequest({ params: followUserParamSchema }), followController.unfollowUser);
router.get('/followers', validateRequest({ query: followListQuerySchema }), followController.getFollowers);
router.get('/following', validateRequest({ query: followListQuerySchema }), followController.getFollowing);

module.exports = router;
