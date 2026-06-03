const { validateRequest } = require('./shared');
const authValidator = require('./auth.validator');
const workoutValidator = require('./workout.validator');
const userValidator = require('./user.validator');
const contactValidator = require('./contact.validator');
const postValidator = require('./post.validator');
const followValidator = require('./follow.validator');
const achievementValidator = require('./achievement.validator');

module.exports = {
  validateRequest,
  authValidator,
  workoutValidator,
  userValidator,
  contactValidator,
  postValidator,
  followValidator,
  achievementValidator,
};
