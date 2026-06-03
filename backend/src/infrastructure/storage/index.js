const config = require('../../core/config');
const logger = require('../../core/logger');

let storageAdapter;

if (config.STORAGE_TYPE === 's3') {
  storageAdapter = require('./s3.adapter');
} else {
  storageAdapter = require('./local.adapter');
}

logger.info({ type: config.STORAGE_TYPE }, 'Storage adapter initialized');

module.exports = storageAdapter;
