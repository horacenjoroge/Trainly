const jwt = require('jsonwebtoken');
const config = require('../core/config');
const { AuthError } = require('../core/errors/AppError');
const { ALS } = require('../core/tracing');
const logger = require('../core/logger');

function authMiddleware(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return next(new AuthError('No token, authorization denied'));
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded.user ? decoded.user : { id: decoded.id || decoded._id };
    const store = ALS.getStore();
    if (store) store.userId = req.user.id;
    next();
  } catch (err) {
    next(new AuthError('Token is not valid'));
  }
}

function optionalAuth(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded.user ? decoded.user : { id: decoded.id || decoded._id };
  } catch (_) {}
  next();
}

module.exports = { authMiddleware, optionalAuth };
