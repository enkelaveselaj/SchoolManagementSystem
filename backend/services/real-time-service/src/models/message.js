const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  room: { type: String, required: true },
  senderEmail: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, default: 'student' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);