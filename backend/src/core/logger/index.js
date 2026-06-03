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
      return (...args) => {
        const store = ALS.getStore();
        const context = {};
        if (store?.traceId) context.traceId = store.traceId;
        if (store?.userId) context.userId = store.userId;

        if (args[0] && typeof args[0] === 'object' && !(args[0] instanceof Error)) {
          target[prop]({ ...context, ...args[0] }, ...args.slice(1));
          return;
        }

        if (Object.keys(context).length > 0) {
          target[prop](context, ...args);
          return;
        }

        target[prop](...args);
      };
    }
    return target[prop];
  }
});
