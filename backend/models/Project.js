const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['AI Agents', 'Neural Networks', 'Quantum Computing', 'Data Intelligence', 'Cyber Security'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  techStack: {
    type: [String],
    default: [],
  },
  mediaUrl: {
    type: String,
    default: '',
  },
  clientLink: {
    type: String,
    default: '',
  },
  githubLink: {
    type: String,
    default: '',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', projectSchema);
