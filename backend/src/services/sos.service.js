const cache = require('../infrastructure/cache');
const messaging = require('../infrastructure/messaging/twilio');
const userRepository = require('../repositories/users/user.repository');
const { RateLimitError, NotFoundError } = require('../core/errors/AppError');
const logger = require('../core/logger');

const sosService = {
  async sendSOS(userId, location, message) {
    const count = await cache.increment(`sos:${userId}`, 3600);
    if (count > 5) throw new RateLimitError('Too many SOS requests. Please try again later.');

    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const Contact = require('../../models/contact');
    const contacts = await Contact.find({ userId });
    if (!contacts || contacts.length === 0) throw new NotFoundError('No emergency contacts found');

    const results = [];
    for (const contact of contacts) {
      try {
        const result = await messaging.sendSOS(contact.phoneNumber, user.name, location);
        results.push({ contact: contact.name, status: result.status });
      } catch (err) {
        logger.error({ err, contact: contact.name }, 'SOS send failed for contact');
        results.push({ contact: contact.name, status: 'failed', error: err.message });
      }
    }

    // Store SOS event
    try {
      const Session = require('mongoose').model('SosEvent') || require('../../models/sosEvent');
      await new Session({ userId, location, message, contacts: contacts.map(c => c.phoneNumber), results, createdAt: new Date() }).save();
    } catch (_) {}

    logger.info({ userId, contactCount: contacts.length }, 'SOS sent');
    return { sent: true, contacts: results };
  },
};

module.exports = sosService;
