const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a blog title'],
    trim: true,
  },
  subtitle: {
    type: String,
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please provide content for the blog post'],
  },
  author: {
    type: String,
    default: 'Novasphere AI Team',
  },
  coverImage: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  readTime: {
    type: String,
    default: '3 min read',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Blog', blogSchema);
