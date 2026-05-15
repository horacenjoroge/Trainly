const pino = require('pino');
const config = require('../config');
const { ALS } = require('../tracing');

const logger = pino({
  level: config.LOG_LEVEL,
  transport: config.NODE_ENV === 'development' ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
  serializers: { err: pino.stdSerializers.err, req: pino.stdSerializers.req, res: pino.stdSerializers.res },
  redact: ['req.headers.authorization', 'req.headers["x-auth-token"]'],
});

module.exports = new Proxy(logger, {
  get(target, prop) {
    if (['trace', 'debug', 'info', 'warn', 'error', 'fatal'].includes(prop)) {
      return (msg, ...args) => {
        const store = ALS.getStore();
        const traceId = store?.traceId;
        const userId = store?.userId;
        target[prop]({ traceId, userId }, msg, ...args);
      };
    }
    return target[prop];
  }
});
