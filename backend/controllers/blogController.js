const Blog = require('../models/Blog');
const mockStore = require('../config/mockDb');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    if (global.dbConnected) {
      const blogs = await Blog.find({}).sort({ createdAt: -1 });
      res.json({ success: true, count: blogs.length, data: blogs });
    } else {
      const blogs = [...mockStore.blogs];
      blogs.sort((a, b) => b.createdAt - a.createdAt);
      res.json({ success: true, count: blogs.length, data: blogs });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
  try {
    if (global.dbConnected) {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }
      res.json({ success: true, data: blog });
    } else {
      const blog = mockStore.blogs.find(b => b._id === req.params.id);
      if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }
      res.json({ success: true, data: blog });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res) => {
  const { title, subtitle, content, coverImage, tags, readTime, author } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Please provide title and content' });
  }

  try {
    const blogData = {
      title,
      subtitle,
      content,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map(t => t.trim()) : [],
      readTime: readTime || '3 min read',
      author: author || 'Novasphere AI Team',
    };

    let newBlog;

    if (global.dbConnected) {
      newBlog = await Blog.create(blogData);
    } else {
      newBlog = {
        _id: 'mock_blog_' + Date.now(),
        ...blogData,
        createdAt: new Date(),
      };
      mockStore.blogs.push(newBlog);
    }

    res.status(201).json({ success: true, data: newBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res) => {
  try {
    const { title, subtitle, content, coverImage, tags, readTime, author } = req.body;

    if (global.dbConnected) {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }

      blog.title = title || blog.title;
      blog.subtitle = subtitle || blog.subtitle;
      blog.content = content || blog.content;
      blog.coverImage = coverImage || blog.coverImage;
      if (tags !== undefined) {
        blog.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
      }
      blog.readTime = readTime || blog.readTime;
      blog.author = author || blog.author;

      const updatedBlog = await blog.save();
      res.json({ success: true, data: updatedBlog });
    } else {
      const index = mockStore.blogs.findIndex(b => b._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }

      const current = mockStore.blogs[index];
      const updated = {
        ...current,
        title: title || current.title,
        subtitle: subtitle || current.subtitle,
        content: content || current.content,
        coverImage: coverImage || current.coverImage,
        tags: tags !== undefined ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : current.tags,
        readTime: readTime || current.readTime,
        author: author || current.author,
      };

      mockStore.blogs[index] = updated;
      res.json({ success: true, data: updated });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res) => {
  try {
    if (global.dbConnected) {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }
      await blog.deleteOne();
      res.json({ success: true, message: 'Blog post removed' });
    } else {
      const index = mockStore.blogs.findIndex(b => b._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }
      mockStore.blogs.splice(index, 1);
      res.json({ success: true, message: 'Blog post removed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
