const asyncHandler = require('../../middleware/asyncHandler');
const contactService = require('../../services/contact.service');
const sosController = require('./sos.controller');

const contactController = {
  list: asyncHandler(async (req, res) => {
    const contacts = await contactService.listContacts(req.user.id);
    res.json(contacts);
  }),

  create: asyncHandler(async (req, res) => {
    const contact = await contactService.createContact(req.user.id, req.validated.body);
    res.status(201).json(contact);
  }),

  update: asyncHandler(async (req, res) => {
    const contact = await contactService.updateContact(req.user.id, req.validated.params.id, req.validated.body);
    res.json(contact);
  }),

  remove: asyncHandler(async (req, res) => {
    const result = await contactService.deleteContact(req.user.id, req.validated.params.id);
    res.json(result);
  }),

  sendSOS: sosController.sendSOS,
};

module.exports = contactController;
