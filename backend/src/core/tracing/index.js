const { AsyncLocalStorage } = require('async_hooks');
const { v4: uuidv4 } = require('uuid');

const ALS = new AsyncLocalStorage();

function traceMiddleware(req, res, next) {
  const traceId = req.headers['x-trace-id'] || uuidv4();
  const store = { traceId, userId: req.user?.id || null };
  ALS.run(store, () => {
    res.setHeader('x-trace-id', traceId);
    next();
  });
}

function getTraceId() { return ALS.getStore()?.traceId; }
function getUserId() { return ALS.getStore()?.userId; }

module.exports = { ALS, traceMiddleware, getTraceId, getUserId };
