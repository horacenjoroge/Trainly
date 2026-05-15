const twilio = require('twilio');
const config = require('../../core/config');
const logger = require('../../core/logger');

let client = null;
if (config.TWILIO_ACCOUNT_SID && config.TWILIO_AUTH_TOKEN) {
  client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
}

const messaging = {
  async sendSMS(to, body) {
    if (!client) { logger.warn({ to }, 'Twilio not configured — SMS not sent'); return { status: 'simulated' }; }
    try {
      const result = await client.messages.create({ body, from: config.TWILIO_PHONE_NUMBER, to });
      logger.info({ sid: result.sid, to }, 'SMS sent');
      return { status: 'sent', sid: result.sid };
    } catch (err) {
      logger.error({ err, to }, 'SMS send failed');
      throw err;
    }
  },

  async sendSOS(to, userName, location) {
    const locationStr = location ? ` at ${location.latitude},${location.longitude}` : '';
    const body = `🚨 EMERGENCY: ${userName} needs help${locationStr}! This is an automated SOS alert from Trainly.`;
    return this.sendSMS(to, body);
  }
};
module.exports = messaging;
