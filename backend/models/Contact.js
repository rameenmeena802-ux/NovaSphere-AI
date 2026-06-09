const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Contact', contactSchema);
