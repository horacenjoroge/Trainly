const Contact = require('../../../models/contact');

const contactRepository = {
  findByUserId: (userId) => Contact.find({ userId }).select('-__v'),
  findOne: (query) => Contact.findOne(query),
  create: (data) => new Contact(data).save(),
  updateByIdAndUserId: (id, userId, data) => Contact.findOneAndUpdate({ _id: id, userId }, data, { new: true, runValidators: true }),
  deleteByIdAndUserId: (id, userId) => Contact.findOneAndDelete({ _id: id, userId }),
};

module.exports = contactRepository;
