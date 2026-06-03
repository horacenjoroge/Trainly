const contactRepository = require('../repositories/contacts/contact.repository');
const { ConflictError, NotFoundError, ValidationError } = require('../core/errors/AppError');
const logger = require('../core/logger');

const contactService = {
  async listContacts(userId) {
    return contactRepository.findByUserId(userId);
  },

  async createContact(userId, data = {}) {
    const name = data.name?.trim();
    const phoneNumber = data.phoneNumber?.trim();

    if (!name || !phoneNumber) {
      throw new ValidationError('Name and phone number are required', [
        { field: 'name', message: 'Name is required' },
        { field: 'phoneNumber', message: 'Phone number is required' },
      ]);
    }

    const existing = await contactRepository.findOne({ userId, phoneNumber });
    if (existing) throw new ConflictError('Phone number already exists for this user');

    const contact = await contactRepository.create({
      userId,
      name,
      phoneNumber,
      relationship: data.relationship,
    });

    logger.info({ userId, contactId: contact._id }, 'Contact created');
    return contact;
  },

  async updateContact(userId, id, data = {}) {
    const name = data.name?.trim();
    const phoneNumber = data.phoneNumber?.trim();

    if (!name || !phoneNumber) {
      throw new ValidationError('Name and phone number are required', [
        { field: 'name', message: 'Name is required' },
        { field: 'phoneNumber', message: 'Phone number is required' },
      ]);
    }

    const existing = await contactRepository.findOne({ userId, phoneNumber, _id: { $ne: id } });
    if (existing) throw new ConflictError('Phone number already exists for this user');

    const contact = await contactRepository.updateByIdAndUserId(id, userId, {
      name,
      phoneNumber,
      relationship: data.relationship,
    });

    if (!contact) throw new NotFoundError('Contact not found');
    logger.info({ userId, contactId: id }, 'Contact updated');
    return contact;
  },

  async deleteContact(userId, id) {
    const contact = await contactRepository.deleteByIdAndUserId(id, userId);
    if (!contact) throw new NotFoundError('Contact not found');
    logger.info({ userId, contactId: id }, 'Contact deleted');
    return { message: 'Contact deleted successfully' };
  },
};

module.exports = contactService;
