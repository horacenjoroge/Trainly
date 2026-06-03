const config = require('../core/config');

const LATENCY_BUCKETS_MS = [50, 100, 250, 500, 1000, 2500, 5000];

const state = {
  startedAt: Date.now(),
  requestsTotal: 0,
  errorsTotal: 0,
  requestDurationMsSum: 0,
  requestDurationMsCount: 0,
  latencyBuckets: Object.fromEntries(LATENCY_BUCKETS_MS.map((bucket) => [bucket, 0])),
  uploadsSuccessTotal: 0,
  uploadsFailureTotal: 0,
  cacheHitsTotal: 0,
  cacheMissesTotal: 0,
  cacheErrorsTotal: 0,
  cacheSkipsTotal: 0,
};

function observeRequest({ durationMs, statusCode }) {
  state.requestsTotal += 1;
  state.requestDurationMsSum += durationMs;
  state.requestDurationMsCount += 1;

  for (const bucket of LATENCY_BUCKETS_MS) {
    if (durationMs <= bucket) state.latencyBuckets[bucket] += 1;
  }
}

function recordError() {
  state.errorsTotal += 1;
}

function recordUploadSuccess() {
  state.uploadsSuccessTotal += 1;
}

function recordUploadFailure() {
  state.uploadsFailureTotal += 1;
}

function recordCacheHit() {
  state.cacheHitsTotal += 1;
}

function recordCacheMiss() {
  state.cacheMissesTotal += 1;
}

function recordCacheError() {
  state.cacheErrorsTotal += 1;
}

function recordCacheSkip() {
  state.cacheSkipsTotal += 1;
}

function getSnapshot(extra = {}) {
  const averageRequestDurationMs = state.requestDurationMsCount > 0
    ? Number((state.requestDurationMsSum / state.requestDurationMsCount).toFixed(2))
    : 0;

  return {
    uptimeSeconds: Math.floor((Date.now() - state.startedAt) / 1000),
    requestsTotal: state.requestsTotal,
    errorsTotal: state.errorsTotal,
    averageRequestDurationMs,
    uploadsSuccessTotal: state.uploadsSuccessTotal,
    uploadsFailureTotal: state.uploadsFailureTotal,
    cacheHitsTotal: state.cacheHitsTotal,
    cacheMissesTotal: state.cacheMissesTotal,
    cacheErrorsTotal: state.cacheErrorsTotal,
    cacheSkipsTotal: state.cacheSkipsTotal,
    latencyBucketsMs: { ...state.latencyBuckets },
    environment: config.NODE_ENV,
    ...extra,
  };
}

function renderPrometheus(extra = {}) {
  const lines = [];
  const snapshot = getSnapshot(extra);

  lines.push('# HELP trainly_requests_total Total HTTP requests processed');
  lines.push('# TYPE trainly_requests_total counter');
  lines.push(`trainly_requests_total ${snapshot.requestsTotal}`);

  lines.push('# HELP trainly_request_errors_total Total HTTP request errors');
  lines.push('# TYPE trainly_request_errors_total counter');
  lines.push(`trainly_request_errors_total ${snapshot.errorsTotal}`);

  lines.push('# HELP trainly_request_duration_ms Request duration in milliseconds');
  lines.push('# TYPE trainly_request_duration_ms histogram');
  for (const bucket of LATENCY_BUCKETS_MS) {
    lines.push(`trainly_request_duration_ms_bucket{le="${bucket}"} ${snapshot.latencyBucketsMs[bucket]}`);
  }
  lines.push(`trainly_request_duration_ms_bucket{le="+Inf"} ${snapshot.requestsTotal}`);
  lines.push(`trainly_request_duration_ms_sum ${state.requestDurationMsSum.toFixed(2)}`);
  lines.push(`trainly_request_duration_ms_count ${snapshot.requestsTotal}`);

  lines.push('# HELP trainly_upload_success_total Successful uploads');
  lines.push('# TYPE trainly_upload_success_total counter');
  lines.push(`trainly_upload_success_total ${snapshot.uploadsSuccessTotal}`);

  lines.push('# HELP trainly_upload_failure_total Failed uploads');
  lines.push('# TYPE trainly_upload_failure_total counter');
  lines.push(`trainly_upload_failure_total ${snapshot.uploadsFailureTotal}`);

  lines.push('# HELP trainly_cache_hits_total Cache hits');
  lines.push('# TYPE trainly_cache_hits_total counter');
  lines.push(`trainly_cache_hits_total ${snapshot.cacheHitsTotal}`);

  lines.push('# HELP trainly_cache_misses_total Cache misses');
  lines.push('# TYPE trainly_cache_misses_total counter');
  lines.push(`trainly_cache_misses_total ${snapshot.cacheMissesTotal}`);

  lines.push('# HELP trainly_cache_errors_total Cache operation errors');
  lines.push('# TYPE trainly_cache_errors_total counter');
  lines.push(`trainly_cache_errors_total ${snapshot.cacheErrorsTotal}`);

  lines.push('# HELP trainly_cache_skips_total Cache operations skipped because Redis is disabled');
  lines.push('# TYPE trainly_cache_skips_total counter');
  lines.push(`trainly_cache_skips_total ${snapshot.cacheSkipsTotal}`);

  lines.push('# HELP trainly_redis_enabled Whether Redis is configured');
  lines.push('# TYPE trainly_redis_enabled gauge');
  lines.push(`trainly_redis_enabled ${snapshot.redis?.enabled ? 1 : 0}`);

  lines.push('# HELP trainly_redis_connected Whether Redis is currently connected');
  lines.push('# TYPE trainly_redis_connected gauge');
  lines.push(`trainly_redis_connected ${snapshot.redis?.connected ? 1 : 0}`);

  lines.push('# HELP trainly_process_uptime_seconds Process uptime in seconds');
  lines.push('# TYPE trainly_process_uptime_seconds gauge');
  lines.push(`trainly_process_uptime_seconds ${snapshot.uptimeSeconds}`);

  return `${lines.join('\n')}\n`;
}

module.exports = {
  observeRequest,
  recordError,
  recordUploadSuccess,
  recordUploadFailure,
  recordCacheHit,
  recordCacheMiss,
  recordCacheError,
  recordCacheSkip,
  getSnapshot,
  renderPrometheus,
};
