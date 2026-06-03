const EventEmitter = require('events');
const logger = require('../core/logger');

class DomainEventEmitter extends EventEmitter {
  emit(eventName, data) {
    logger.debug({ event: eventName }, 'Domain event emitted');
    super.emit(eventName, data);
  }
}

const emitter = new DomainEventEmitter();
emitter.setMaxListeners(50);
module.exports = emitter;
