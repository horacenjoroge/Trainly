const express = require('express');
const path = require('path');
const fs = require('fs');

const { traceMiddleware } = require('./core/tracing');
const { securityMiddleware, generalLimiter } = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const notFound = require('./middleware/notFound');

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
app.use(requestLogger);

// Static files
const dirs = ['public', 'public/uploads', 'public/uploads/avatars', 'public/uploads/posts'];
dirs.forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// === API Routes ===
app.use(require('./api/routes/docs.routes'));
app.use(require('./api/routes/observability.routes'));
app.use('/api/auth', require('./api/routes/auth.routes'));
app.use('/api/users', require('./api/routes/user.routes'));
app.use('/api/posts', require('./api/routes/post.routes'));
app.use('/api/workouts', require('./api/routes/workout.routes'));
app.use('/api/achievements', require('./api/routes/achievement.routes'));
app.use('/api/follow', require('./api/routes/follow.routes'));
app.use('/api/contacts', require('./api/routes/contact.routes'));
app.use('/api/uploads', require('./api/routes/upload.routes'));

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;
