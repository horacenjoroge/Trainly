const envalid = require('envalid');
const { str, num, url } = envalid;

const env = envalid.cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development', choices: ['development', 'production', 'test'] }),
  PORT: num({ default: 3000 }),
  MONGODB_URI: str(),
  JWT_SECRET: str(),
  REFRESH_TOKEN_SECRET: str({ default: '' }),
  TWILIO_ACCOUNT_SID: str({ default: '' }),
  TWILIO_AUTH_TOKEN: str({ default: '' }),
  TWILIO_PHONE_NUMBER: str({ default: '' }),
  REDIS_URL: str({ default: '' }),
  STORAGE_TYPE: str({ default: 'local', choices: ['local', 's3'] }),
  LOG_LEVEL: str({ default: 'info', choices: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] }),
  RATE_LIMIT_WINDOW_MS: num({ default: 60000 }),
  RATE_LIMIT_MAX: num({ default: 100 }),
  SOS_RATE_LIMIT_MAX: num({ default: 5 }),
  CORS_ORIGIN: str({ default: '*' }),
});

module.exports = env;
