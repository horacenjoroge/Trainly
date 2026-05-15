require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const config = require('./core/config');
const logger = require('./core/logger');
const { traceMiddleware } = require('./core/tracing');
const { securityMiddleware, generalLimiter } = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');
const { registerAllHandlers } = require('./events/register');

// === Initialize ===
const app = express();

// Security
app.use(securityMiddleware);
app.use(generalLimiter);

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

// Request tracing
app.use(traceMiddleware);

// Request logging
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, 'Request');
  next();
});

// Static files
const dirs = ['public', 'public/uploads', 'public/uploads/avatars', 'public/uploads/posts'];
dirs.forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// === Database ===
mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => logger.info('MongoDB connected'))
  .catch(err => { logger.error({ err }, 'MongoDB connection failed'); process.exit(1); });

// === Register event handlers ===
registerAllHandlers();

// === API Routes ===
app.use('/api/auth', require('./api/routes/auth.routes'));
app.use('/api/users', require('./api/routes/user.routes'));
app.use('/api/posts', require('./api/routes/post.routes'));
app.use('/api/workouts', require('./api/routes/workout.routes'));
app.use('/api/achievements', require('./api/routes/achievement.routes'));
app.use('/api/follow', require('./api/routes/follow.routes'));
app.use('/api/contacts', require('./api/routes/contact.routes'));
app.use('/api/uploads', require('./api/routes/upload.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok', time: new Date().toISOString(), environment: config.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    version: '2.0.0',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', code: 'NOT_FOUND', message: `Route ${req.method} ${req.url} not found` });
});

// Error handler
app.use(errorHandler);

// Graceful shutdown
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
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

module.exports = app;

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info({ port: PORT, env: config.NODE_ENV }, `Server started`);
});
