const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('../core/config');

const securityMiddleware = [
  helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }),
  cors({ origin: config.CORS_ORIGIN === '*' ? '*' : config.CORS_ORIGIN.split(','), methods: ['GET','POST','PUT','DELETE','PATCH'], allowedHeaders: ['Content-Type','x-auth-token','Authorization','x-trace-id'] }),
];

const generalLimiter = rateLimit({ windowMs: config.RATE_LIMIT_WINDOW_MS, max: config.RATE_LIMIT_MAX, standardHeaders: true, legacyHeaders: false, message: { status: 'error', code: 'RATE_LIMIT', message: 'Too many requests' } });

const sosLimiter = rateLimit({ windowMs: 3600000, max: config.SOS_RATE_LIMIT_MAX, standardHeaders: true, legacyHeaders: false, message: { status: 'error', code: 'SOS_RATE_LIMIT', message: 'Too many SOS requests' } });

module.exports = { securityMiddleware, generalLimiter, sosLimiter };
