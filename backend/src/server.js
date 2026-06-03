require('dotenv').config();

const mongoose = require('mongoose');

const app = require('./app');
const config = require('./core/config');
const logger = require('./core/logger');
const { registerAllHandlers } = require('./events/register');

let handlersRegistered = false;

async function connectDatabase() {
  await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  logger.info('MongoDB connected');
}

function ensureHandlersRegistered() {
  if (handlersRegistered) return;
  registerAllHandlers();
  handlersRegistered = true;
}

async function shutdown(signal) {
  logger.info({ signal }, 'Shutting down gracefully');
  try {
    await mongoose.connection.close();
    const cache = require('./infrastructure/cache');
    await cache.quit();
    logger.info('Connections closed');
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Shutdown error');
    process.exit(1);
  }
}

async function startServer() {
  try {
    await connectDatabase();
    ensureHandlersRegistered();
    const server = app.listen(config.PORT, () => {
      logger.info({ port: config.PORT, env: config.NODE_ENV }, 'Server started');
    });
    return server;
  } catch (err) {
    logger.error({ err }, 'MongoDB connection failed');
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
