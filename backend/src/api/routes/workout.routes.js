const { Router } = require('express');
const workoutController = require('../controllers/workout.controller');
const { authMiddleware } = require('../../middleware/auth');
const { validateRequest } = require('../validators');
const {
  commentSchema,
  createWorkoutSchema,
  idParamSchema,
  paginationQuery,
  publicFeedQuery,
  statsQuery,
  updateWorkoutSchema,
} = require('../validators/workout.validator');

const router = Router();

router.get('/public/feed', validateRequest({ query: publicFeedQuery }), workoutController.publicFeed);
router.post('/', authMiddleware, validateRequest({ body: createWorkoutSchema }), workoutController.create);
router.get('/', authMiddleware, validateRequest({ query: paginationQuery }), workoutController.list);
router.get('/stats/summary', authMiddleware, validateRequest({ query: statsQuery }), workoutController.stats);
router.get('/:id', authMiddleware, validateRequest({ params: idParamSchema }), workoutController.get);
router.patch('/:id', authMiddleware, validateRequest({ params: idParamSchema, body: updateWorkoutSchema }), workoutController.update);
router.delete('/:id', authMiddleware, validateRequest({ params: idParamSchema }), workoutController.delete);
router.post('/:id/like', authMiddleware, validateRequest({ params: idParamSchema }), workoutController.toggleLike);
router.post('/:id/comments', authMiddleware, validateRequest({ params: idParamSchema, body: commentSchema }), workoutController.addComment);

module.exports = router;
