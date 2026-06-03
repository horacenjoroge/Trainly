const logger = require('../core/logger');
const metrics = require('../observability/metrics');

function requestLogger(req, res, next) {
  const startedAt = process.hrtime.bigint();
  const requestContentLength = req.headers['content-length'];

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    metrics.observeRequest({
      durationMs,
      statusCode: res.statusCode,
    });
    logger.info({
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      requestContentLength: requestContentLength ? Number(requestContentLength) : 0,
    }, 'Request completed');
  });

  next();
}

module.exports = requestLogger;
