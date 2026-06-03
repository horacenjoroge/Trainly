const { Router } = require('express');
const { authMiddleware } = require('../../middleware/auth');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const { validateRequest } = require('../validators');
const { imageUpload } = require('../../middleware/upload');
const {
  followUserParamSchema,
  socialUserQuerySchema,
  updateProfileSchema,
  updateStatsSchema,
  userIdParamSchema,
  userSearchParamSchema,
  userSearchQuerySchema,
} = require('../validators/user.validator');
const { achievementListQuerySchema } = require('../validators/achievement.validator');

const router = Router();
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', validateRequest({ body: updateProfileSchema }), userController.updateProfile);
router.put('/stats', validateRequest({ body: updateStatsSchema }), userController.updateStats);
router.get('/fullprofile', userController.getFullProfile);
router.post('/avatar', imageUpload.single('image'), uploadController.uploadAvatar);
router.get('/followers', validateRequest({ query: socialUserQuerySchema }), userController.getFollowers);
router.get('/following', validateRequest({ query: socialUserQuerySchema }), userController.getFollowing);
router.post('/follow/:userId', validateRequest({ params: followUserParamSchema }), userController.followUser);
router.delete('/follow/:userId', validateRequest({ params: followUserParamSchema }), userController.unfollowUser);
router.get('/achievements', validateRequest({ query: achievementListQuerySchema }), userController.getAchievements);
router.get('/search', validateRequest({ query: userSearchQuerySchema }), userController.search);
router.get('/search/:query', validateRequest({ params: userSearchParamSchema }), userController.search);
router.get('/:id', validateRequest({ params: userIdParamSchema }), userController.getById);

module.exports = router;
