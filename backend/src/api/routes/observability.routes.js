const { Router } = require('express');
const os = require('os');
const mongoose = require('mongoose');

const config = require('../../core/config');
const metrics = require('../../observability/metrics');
const cache = require('../../infrastructure/cache');

const router = Router();

router.get('/api/health', (req, res) => {
  const redisStatus = cache.getStatus();
  const databaseConnected = mongoose.connection.readyState === 1;
  const status = databaseConnected ? 'ok' : 'degraded';
  const memoryUsage = process.memoryUsage();

  res.status(databaseConnected ? 200 : 503).json({
    status,
    time: new Date().toISOString(),
    environment: config.NODE_ENV,
    version: '2.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: databaseConnected ? 'connected' : 'disconnected',
      readyState: mongoose.connection.readyState,
    },
    redis: redisStatus,
    storage: {
      configuredType: config.STORAGE_TYPE,
      activeMode: config.STORAGE_TYPE === 's3' ? 's3-fallback-local' : 'local',
      publicBasePath: '/uploads',
    },
    memory: {
      rss: memoryUsage.rss,
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed,
      external: memoryUsage.external,
    },
    host: {
      platform: process.platform,
      nodeVersion: process.version,
      hostname: os.hostname(),
    },
    observability: {
      traceHeader: 'x-trace-id',
      metricsEndpoint: '/metrics',
      docsEndpoint: '/docs',
    },
    metrics: metrics.getSnapshot({ redis: redisStatus }),
  });
});

router.get('/metrics', (req, res) => {
  const redisStatus = cache.getStatus();
  res.type('text/plain; version=0.0.4; charset=utf-8');
  res.send(metrics.renderPrometheus({ redis: redisStatus }));
});

module.exports = router;
