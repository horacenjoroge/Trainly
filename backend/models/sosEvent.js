const mongoose = require('mongoose');
const sosEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  location: { latitude: Number, longitude: Number },
  message: String,
  contacts: [String],
  results: [{ contact: String, status: String, error: String }],
  createdAt: { type: Date, default: Date.now, index: true },
});
sosEventSchema.index({ userId: 1, createdAt: -1 });
module.exports = mongoose.models.SosEvent || mongoose.model('SosEvent', sosEventSchema);
