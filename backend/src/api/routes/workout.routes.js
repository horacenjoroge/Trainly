const { Router } = require('express');
const workoutController = require('../controllers/workout.controller');
const { authMiddleware } = require('../../middleware/auth');

const router = Router();
router.use(authMiddleware);

router.post('/', workoutController.create);
router.get('/', workoutController.list);
router.get('/stats/summary', workoutController.stats);
router.get('/public/feed', workoutController.publicFeed);
router.get('/:id', workoutController.get);
router.patch('/:id', workoutController.update);
router.delete('/:id', workoutController.delete);
router.post('/:id/like', workoutController.toggleLike);
router.post('/:id/comments', workoutController.addComment);

module.exports = router;
