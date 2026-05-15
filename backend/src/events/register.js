const { registerWorkoutHandlers } = require('./handlers/workoutHandlers');

function registerAllHandlers() {
  registerWorkoutHandlers();
  logger.info('All domain event handlers registered');
}

const logger = require('../core/logger');
module.exports = { registerAllHandlers };
