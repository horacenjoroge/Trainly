const { Router } = require('express');
const asyncHandler = require('../../middleware/asyncHandler');
const { authMiddleware } = require('../../middleware/auth');
const Contact = require('../../../models/contact');
const sosController = require('../controllers/sos.controller');

const router = Router();
router.use(authMiddleware);

router.get('/', asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ userId: req.user.id }).select('-__v');
  res.json(contacts);
}));

router.post('/', asyncHandler(async (req, res) => {
  const { name, phoneNumber, relationship } = req.body;
  if (!name || !phoneNumber) return res.status(400).json({ message: 'Name and phone required' });
  const existing = await Contact.findOne({ phoneNumber, userId: req.user.id });
  if (existing) return res.status(400).json({ message: 'Phone already exists' });
  const contact = await new Contact({ name, phoneNumber, relationship, userId: req.user.id }).save();
  res.status(201).json(contact);
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const contact = await Contact.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  res.json(contact);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const contact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!contact) return res.status(404).json({ message: 'Contact not found' });
  res.json({ message: 'Deleted' });
}));

router.post('/send-sos', sosController.sendSOS);

module.exports = router;
