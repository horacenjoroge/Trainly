const SosEvent = require('../../../models/sosEvent');

const sosEventRepository = {
  create: (data) => new SosEvent(data).save(),
};

module.exports = sosEventRepository;
